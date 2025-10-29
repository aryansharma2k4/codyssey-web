import { DM_Sans } from "next/font/google";
import TeamPricing from "./TeamPricing";

const dm_sans = DM_Sans();

export default function FooterSection() {
  return (
    <div
      className={`${dm_sans.className} flex flex-col items-center min-h-60 mt-36 pb-36 bg-linear-to-t from-[#6b1b00] via-[#0b0000] to-[#070707]`}
    >
      <h1 className="font-medium text-3xl md:text-5xl mb-5">
        Can you survive the <span className="italic">CODYSSEY?</span>
      </h1>
      <div className="flex space-x-5">
        <TeamPricing />
      </div>
    </div>
  );
}
