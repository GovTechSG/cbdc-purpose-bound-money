"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";

interface HeroImageProps {
  src: StaticImageData;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        className="drop-shadow-xl sm:drop-shadow-2xl rounded-md"
      />
    </div>
  );
}
