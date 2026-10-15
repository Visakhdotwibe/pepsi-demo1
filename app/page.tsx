
import { HomeCont2 } from "./components/home-contn2/HomeCont2";
import HomeCont1 from "./components/home-contnt1/HomeCont1";
import PageLoader from "./components/PageLoader";
import PepsiHero from "./components/PepsiHero";
import ProductListHome from "./components/pruduct-list/product-home-list";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PageLoader />

      <main>
        <PepsiHero />
        <ProductListHome />
        <HomeCont1 />
        <HomeCont2 />
        <footer style={{ minHeight: "358px" }} />
      </main>
    </>
  );
}
