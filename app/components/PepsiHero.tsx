
"use client";

import { useEffect, useRef } from "react";

export default function PepsiHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    let animationFrame = 0;

    const updateVideo = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollDistance = section.offsetHeight - window.innerHeight;

        if (scrollDistance <= 0 || !video.duration) return;

        // Calculate how far the user has scrolled through the hero
        const scrolled = Math.min(
          Math.max(-rect.top, 0),
          scrollDistance
        );

        const progress = scrolled / scrollDistance;

        // Map scroll progress to the video's timeline
        const targetTime = progress * video.duration;

        if (Math.abs(video.currentTime - targetTime) > 0.1) {
          video.currentTime = targetTime;
        }
      });
    };

    video.addEventListener("loadedmetadata", updateVideo);
    window.addEventListener("scroll", updateVideo, {
      passive: true,
    });
    window.addEventListener("resize", updateVideo);

    updateVideo();

    return () => {
      cancelAnimationFrame(animationFrame);
      video.removeEventListener("loadedmetadata", updateVideo);
      window.removeEventListener("scroll", updateVideo);
      window.removeEventListener("resize", updateVideo);
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

        <div className="scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}
