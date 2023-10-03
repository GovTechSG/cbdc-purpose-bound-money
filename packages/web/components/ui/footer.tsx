import { TextLink } from "@web/components/ui/text-link";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="border-t border-t-gray-100 pt-16 min-h-[5] drop-shadow-lg" />
          <div className="text-center text-gray-400 text-xs md:text-sm leading-5">
            <div>
              Buidl with{" "}
              <Link href="https://github.com/superical" target="_blank">
                <Image
                  src="images/heart.svg"
                  alt="Love"
                  title="Love"
                  width={12}
                  height={12}
                  className="inline-flex"
                />
              </Link>{" "}
              by{" "}
              <TextLink href="https://www.tech.gov.sg" target="_blank">
                GovTech
              </TextLink>{" "}
              for{" "}
              <TextLink
                href="https://www.mas.gov.sg/schemes-and-initiatives/project-orchid"
                target="_blank"
              >
                Project Orchid
              </TextLink>
              .
            </div>
            <div>&copy; {getYear(2023)}. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const getYear = (start: number) => {
  const now = new Date().getFullYear();
  return start === now ? start : `${start} – ${now}`;
};
