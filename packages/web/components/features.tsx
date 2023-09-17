import HeroImage from "@web/components/hero-image";
import { SecondaryLinkButton } from "@web/components/secondary-link-button";
import heroDashboardImage from "@web/public/images/hero-dashboard.png";
import React from "react";

export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="pb-8 md:pb-10">
          <HeroImage
            src={heroDashboardImage}
            alt="Dashboard of the Purpose Bound Money (PBM) app"
          />
        </div>
        <div className="flex justify-center pb-10 md:pb-16">
          <SecondaryLinkButton href={process.env.NEXT_PUBLIC_UX_FEATURE_DECK!}>
            See Feature Screens Deck
          </SecondaryLinkButton>
        </div>
      </div>
    </section>
  );
}
