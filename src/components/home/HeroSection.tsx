"use client";

import Image from "next/image";
import AppBar from "@/components/home/AppBar";
import HeroContent from "./HeroContent";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#3b0f00] via-[#0b0000] to-[#070707]">
      {/* AppBar should be ABOVE pumpkins */}
      <div className="absolute top-0 left-0 w-full z-30">
        <AppBar />
      </div>

      <div className="absolute top-10 right-20 w-[190px] md:w-[180px] rotate-10 blur-[1px] opacity-90">
        <Image
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain"
          priority
        />
      </div>

      {/* Top-left pumpkin */}
      <div className="absolute top-0 left-0 w-[150px] md:w-[250px] -rotate-25 blur-[2px] opacity-70">
        <Image
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain"
          priority
        />
      </div>

      {/* Bottom-left pumpkin */}
      <div className="absolute bottom-0 left-10 w-40 md:w-[220px] rotate-15 blur-[1.5px] opacity-80">
        <Image
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain"
          priority
        />
      </div>

      {/* Bottom-right pumpkin */}
      <div className="absolute bottom-0 right-10 w-40 md:w-[220px] -rotate-10 blur-[1.5px] opacity-85">
        <Image
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <HeroContent />
      </div>
    </div>
  );
}
