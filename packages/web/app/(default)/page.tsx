import Features from "@web/components/features";
import UpperFoldSection from "@web/components/upper-fold-section";

export const metadata = {
  title: "Home – Purpose Bound Money (PBM)",
  description: "A protocol for the use of digital money under specified conditions.",
};

export default function Home() {
  return (
    <>
      <UpperFoldSection baseUrl={process.env.NEXT_PUBLIC_BASE_URL!} />
      <Features />
    </>
  );
}
