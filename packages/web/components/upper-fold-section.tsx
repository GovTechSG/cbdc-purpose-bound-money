"use client";

import { SecondaryLinkButton } from "@web/components/secondary-link-button";
import React from "react";
import Typewriter from "typewriter-effect";

interface UpperFoldSectionProps {
  baseUrl: string;
}

export default function UpperFoldSection({ baseUrl }: UpperFoldSectionProps) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="relative pt-32 md:pt-30">
          <HeroUnit baseUrl={baseUrl} />
        </div>
      </div>
    </section>
  );
}

const HeroUnit: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  return (
    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
      <div
        className="text-gray-500 text-sm md:text-lg font-medium"
        data-aos="fade-up"
      >
        Programmable Digital Currency
      </div>
      <h1
        className="h1 text-5xl md:text-8xl pb-1.5 bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-600 via-zinc-800 to-zinc-950"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Purpose Bound Money
      </h1>
      <div
        className="mb-4 text-gray-500 text-3xl md:text-4xl"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        For{" "}
        <span className="text-blue-500">
          <Typewriter
            options={{
              strings: [
                "Payments",
                "Governments",
                "Businesses",
                "Work",
                "Spending",
                "Transactions",
                "Donations",
                "A Good Intent",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </div>
      <p
        className="text-normal md:text-xl text-gray-500 mb-8"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        The Purpose Bound Money (PBM) proposes a protocol for the use of digital
        money under specified conditions. As part of a wider pilot in Project
        Orchid, this iteration of the protocol releases escrow payments
        automatically after a specified period.
      </p>
      <CallToActionButtons baseUrl={baseUrl} />
    </div>
  );
};

const CallToActionButtons: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const baseUrlHost = new URL(baseUrl).host;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "#";

  return (
    <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
      <div data-aos="fade-up" data-aos-delay="400">
        <a
          className="btn text-white bg-blue-600 hover:bg-blue-950 transition-all duration-500 w-full mb-4 sm:w-auto sm:mb-0 rounded-md"
          rel="noopener noreferrer"
          href={`//app.${baseUrlHost}`}
        >
          Launch App
        </a>
      </div>
      <div>
        <div className="flex justify-between sm:hidden">
          <WhitepaperCtaButton />
          <GithubCtaButton url={githubUrl} />
        </div>
      </div>
      <div className="hidden sm:flex">
        <WhitepaperCtaButton />
        <GithubCtaButton url={githubUrl} />
      </div>
    </div>
  );
};

const WhitepaperCtaButton: React.FC = () => {
  return (
    <div data-aos="fade-up" data-aos-delay="600">
      <SecondaryLinkButton href="https://www.mas.gov.sg/-/media/mas-media-library/development/fintech/project-orchid/mas-project-orchid-report.pdf">
        Project Orchid Whitepaper
      </SecondaryLinkButton>
    </div>
  );
};

const GithubCtaButton: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div data-aos="fade-up" data-aos-delay="800" className="md:grid">
      <a
        className="btn p-3 text-gray-600 bg-transparent border-gray-400 rounded-md hover:bg-neutral-200 hover:text-white transition-all duration-500 aspect-square w-auto sm:ml-4"
        rel="noopener noreferrer"
        target="_blank"
        href={url}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
    </div>
  );
};
