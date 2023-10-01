import Features from "@web/components/features";
import HeroUnit from "@web/components/hero-unit";
import UpperFoldSection from "@web/components/upper-fold-section";

export const metadata = {
  title: "Purpose Bound Money (PBM)",
  description:
    "A protocol for the use of digital money under specified conditions.",
};

export default function Home() {
  return (
    <>
      <UpperFoldSection baseUrl={process.env.NEXT_PUBLIC_BASE_URL!} />
      <HeroUnit />
      <Features />
    </>
  );
}
