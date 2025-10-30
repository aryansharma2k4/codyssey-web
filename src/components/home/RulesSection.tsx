"use client";

import { Griffy, IM_Fell_English_SC } from "next/font/google";
import Image from "next/image";

const griffy = Griffy({
  weight: "400",
});

const im_fell = IM_Fell_English_SC({
  weight: "400",
});

export default function RulesSection() {
  const rules = [
    {
      title: "Team Participation:",
      text: "This is a team-based contest. Each team may consist of up to 3 members. All submissions must be the original collaborative work of the registered team members.",
    },
    {
      title: "Communication:",
      text: "Teams may communicate only within their own members. Any exchange of ideas or discussions with other teams is strictly prohibited during the contest.",
    },
    {
      title: "Third-Party Code:",
      text: "Teams may reuse their own pre-written code. Using code from external sources, other teams, or AI tools during the contest is strictly forbidden.",
    },
    {
      title: "AI Usage:",
      text: "AI tools are not allowed during the contest. Live monitoring will be conducted by the OC and Codeforces, and use of AI-generated content will result in disqualification.",
    },
    {
      title: "System Integrity:",
      text: "Teams must not attempt to hack, disrupt, or manipulate the contest system. Multiple or proxy accounts are not permitted.",
    },
    {
      title: "Plagiarism Monitoring:",
      text: "All submissions will be checked for plagiarism and suspicious similarities. Repeated violations will result in disqualification, and post-contest checks will verify code authenticity.",
    },
    {
      title: "Scoring Format:",
      text: `Round 1 & Round 2: ICPC-style scoring

Teams are ranked by the number of problems solved.
Ties are broken by total penalty time (based on submission time and wrong attempts).

Round 3: Testcase-based scoring

Each problem contains multiple test cases.
Teams earn partial marks for every test case passed.
Final ranking is based on total marks obtained across all test cases.`,
    },
    {
      title: "Guidelines:",
      text: `Leaderboard:
All submissions will be checked for plagiarism and suspicious similarities.
Repeated violations will result in disqualification, and post-contest checks will verify code authenticity.

Appeals:
If a team believes they were wrongly warned or disqualified, they may appeal immediately during the contest by contacting the OC.

Clarifications:
For any queries or technical issues during the contest, teams should reach out directly to the OC at the venue.

Duration:
Round 1: 1.5 hours
Round 2: 1.5 hours
Round 3: 1.5 hours`,
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden py-16">
      {/* Larger top pumpkin background */}
      <div className="absolute inset-0 -z-10 flex justify-end items-start pt-10">
        <div className="relative w-[1200px] h-[700px] opacity-30 rotate-12 blur-sm">
          <Image
            src="/pumpkin.png"
            alt="Pumpkin background"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom-left pumpkin */}
      <div className="absolute bottom-0 left-20 w-64 blur-xs opacity-70">
        <Image
          src="/pumpkin.png"
          alt="Bottom pumpkin"
          width={290}
          height={290}
          className="object-contain drop-shadow-[0_0_20px_rgba(255,120,0,0.6)]"
        />
      </div>

      {/* Middle-right pumpkin */}
      <div className="absolute top-1/2 right-20 w-60 opacity-60 blur-[1px] -rotate-45 translate-y-[-50%]">
        <Image
          src="/pumpkin.png"
          alt="Right middle pumpkin"
          width={260}
          height={260}
          className="object-contain drop-shadow-[0_0_20px_rgba(255,120,0,0.5)] rotate-36"
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center px-6 space-y-10">
        <h1
          className={`${griffy.className} text-5xl sm:text-7xl font-bold text-center text-orange-300 drop-shadow-[0_0_15px_rgba(255,150,0,0.8)]`}
        >
          Rules 🎃
        </h1>

        <div
          className={`${im_fell.className} max-w-3xl w-full space-y-10 mt-7 text-[#EECFA7]`}
        >
          {rules.map((rule, i) => (
            <div
              key={i}
              className="bg-linear-to-br from-[#1a0f08]/90 to-[#2b1a10]/90 border border-orange-900 p-6 shadow-[0_0_25px_rgba(255,120,0,0.3)] backdrop-blur-sm transition-transform hover:scale-[1.02]"
            >
              <h2 className="text-4xl underline mb-2">{rule.title}</h2>
              <p className="text-xl leading-relaxed whitespace-pre-line">
                {rule.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
