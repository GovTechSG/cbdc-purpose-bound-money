import HeroImage from "@web/components/hero-image";
import heroDashboardImage from "@web/public/images/hero-dashboard.webp";
import React from "react";

export default function HeroUnit() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="pb-8 md:pb-10">
          <div
            className="relative flex justify-center items-center min-w-[60rem] sm:min-w-full"
            data-aos="fade-up"
            data-aos-delay="500"
            data-aos-anchor-placement="top-bottom"
          >
            <HeroImage
              src={heroDashboardImage}
              alt="Dashboard of the Purpose Bound Money (PBM) app"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
