import { TextLink } from "@web/components/ui/text-link";
import React from "react";

export default function Acknowledgements() {
  return (
    <section>
      <div className="max-w-6xl mx-auto pt-10 px-4 sm:px-6 relative">
        <div className="py-12 md:py-20 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center pb-5 md:pb-8">
            <h2 className="h2 mb-4" data-aos="fade-up" data-aos-delay="100">
              Acknowledgements
            </h2>
            <p className="text-normal md:text-lg text-gray-400" data-aos="fade-up" data-aos-delay="200">
              The{" "}
              <TextLink
                href="https://www.mas.gov.sg/schemes-and-initiatives/project-orchid"
                target="_blank"
              >
                Project Orchid
              </TextLink>{" "}
              is a pilot project initiated by the{" "}
              <TextLink href="https://www.mas.gov.sg" target="_blank">
                Monetary Authority of Singapore
              </TextLink>
              . This iteration of the Purpose Bound Money (PBM) in the project
              is developed in collaboration with{" "}
              <TextLink
                href="https://www.myskillsfuture.gov.sg"
                target="_blank"
              >
                SkillsFuture Singapore
              </TextLink>
              ,{" "}
              <TextLink href="https://www.uob.com.sg" target="_blank">
                United Overseas Bank
              </TextLink>{" "}
              and{" "}
              <TextLink href="https://www.tech.gov.sg" target="_blank">
                GovTech Singapore
              </TextLink>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
