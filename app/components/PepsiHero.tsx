"use client";

import { useEffect, useRef } from "react";

export default function PepsiHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const indicator = indicatorRef.current;

    if (!section || !video) return;

    const DAMPING = 0.12;
    let disposed = false;

    const calculateTarget = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;

      if (scrollDistance <= 0) {
        targetTimeRef.current = 0;
        return;
      }

      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        scrollDistance
      );

      const progress = scrolled / scrollDistance;

      targetTimeRef.current =
        progress * Math.max(0, video.duration - 0.05);
    };

    const render = (now: number) => {
      if (disposed) return;

      const delta = lastTimeRef.current
        ? Math.min((now - lastTimeRef.current) / 16.67, 3)
        : 1;

      lastTimeRef.current = now;

      const factor = 1 - Math.pow(1 - DAMPING, delta);

      const target = targetTimeRef.current;

      currentTimeRef.current +=
        (target - currentTimeRef.current) * factor;

      if (Math.abs(target - currentTimeRef.current) < 0.005) {
        currentTimeRef.current = target;
      }

      // Do not issue another seek while the decoder is busy.
      if (
        video.readyState >= HTMLMediaElement.HAVE_METADATA &&
        Number.isFinite(video.duration) &&
        !video.seeking &&
        Math.abs(video.currentTime - currentTimeRef.current) > 0.04
      ) {
        try {
          video.currentTime = Math.min(
            currentTimeRef.current,
            Math.max(0, video.duration - 0.05)
          );
        } catch {
          // The browser may temporarily reject a seek.
        }
      }

      if (indicator && video.duration > 0) {
        const progress = currentTimeRef.current / video.duration;
        const opacity = Math.max(0, 1 - progress * 6);

        indicator.style.opacity = String(opacity);
        indicator.style.pointerEvents =
          opacity <= 0.01 ? "none" : "auto";
      }

      const easing = Math.abs(
        targetTimeRef.current - currentTimeRef.current
      ) > 0.005;

      const needsSeek =
        !video.seeking &&
        Math.abs(video.currentTime - currentTimeRef.current) > 0.04;

      // Keep rendering while easing, seeking, or waiting to catch up.
      if (easing || video.seeking || needsSeek) {
        rafIdRef.current = requestAnimationFrame(render);
      } else {
        rafIdRef.current = null;
        lastTimeRef.current = 0;
      }
    };

    const startLoop = () => {
      if (disposed || rafIdRef.current !== null) return;

      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(render);
    };

    const onScroll = () => {
      calculateTarget();
      startLoop();
    };

    const onMetadataLoaded = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.pause();
      calculateTarget();

      currentTimeRef.current = targetTimeRef.current;

      try {
        video.currentTime = targetTimeRef.current;
      } catch {
        // Wait for the browser to make the media seekable.
      }

      startLoop();
    };

    const onSeeked = () => {
      // A new scroll target may have arrived during the previous seek.
      if (
        Math.abs(targetTimeRef.current - currentTimeRef.current) > 0.005 ||
        Math.abs(video.currentTime - currentTimeRef.current) > 0.04
      ) {
        startLoop();
      }
    };

    video.addEventListener("loadedmetadata", onMetadataLoaded);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onMetadataLoaded();
    }

    return () => {
      disposed = true;

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      video.removeEventListener("loadedmetadata", onMetadataLoaded);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="pepsi-scroll-section">
      <div className="pepsi-sticky-hero">
        <video
          ref={videoRef}
          className="pepsi-hero-video"
          src="/videos/pepsi-banner.mp4"
          muted
          playsInline
          preload="auto"
          aria-label="Pepsi product pouring animation"
        />

        <div className="pepsi-hero-content">
          <p>INTRODUCING THE NEW</p>
          <h1>Refresh Your World.</h1>
          <p>Discover a new taste experience.</p>
        </div>

        <div className="scroll-indicator" ref={indicatorRef}>
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}