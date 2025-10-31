"use client";

import Link from "next/link";
// import Image from "next/image"; // Replaced with <img>
import AppBar from "../home/AppBar"; // Fixed alias path
import HeroContent from "./HeroContent"; // Added .tsx extension
import { Hubot_Sans } from "next/font/google";
const hubot_sans = Hubot_Sans();

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#3b0f00] via-[#0b0000] to-[#070707]">
      {/* AppBar should be ABOVE pumpkins */}
      <div className="absolute top-0 left-0 w-full z-30">
        <AppBar />
      </div>

      <div className="absolute top-10 right-20 w-[190px] md:w-[180px] rotate-10 blur-[1px] opacity-90">
        {/* Replaced Next/Image with <img> */}
        <img
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain w-full h-full" // Added w-full h-full
          loading="eager" // Replaced priority
        />
      </div>

      {/* Top-left pumpkin */}
      <div className="absolute top-0 left-0 w-[150px] md:w-[250px] -rotate-25 blur-[2px] opacity-70">
        <img
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain w-full h-full"
          loading="eager"
        />
      </div>

      {/* Bottom-left pumpkin */}
      <div className="absolute bottom-0 left-10 w-40 md:w-[220px] rotate-15 blur-[1.5px] opacity-80">
        <img
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain w-full h-full"
          loading="eager"
        />
      </div>

      {/* Bottom-right pumpkin */}
      <div className="absolute bottom-0 right-10 w-40 md:w-[220px] -rotate-10 blur-[1.5px] opacity-85">
        <img
          src="/pumpkin.png"
          alt="pumpkin"
          width={300}
          height={300}
          className="object-contain w-full h-full"
          loading="eager"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <HeroContent />

        <Link href="" target="_blank">
          <button className={`${hubot_sans.className} bg-[#FF7023] hover:bg-[#E41600] border-[#E41600] border-4 transition-all p-5 mt-8 rounded-3xl text-2xl font-medium self-center focus:ring-blue-700 focus:ring-4`}>
            Join the Contest
          </button>{" "}
        </Link>
      </div>
    </div>
  );
}
