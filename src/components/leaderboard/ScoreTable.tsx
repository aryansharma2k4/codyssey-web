import { IM_Fell_English_SC } from "next/font/google";

const im_fell = IM_Fell_English_SC({
  weight: "400",
});

interface Challenge {
  score: string;
  time: string;
}

interface TableEntry {
  rank: string;
  teamName: string;
  totalScore: string;
  challenges: (Challenge | null)[];
  isHighlighted: boolean;
}

const tableData: TableEntry[] = [
  {
    rank: "1",
    teamName: "Team Alpha",
    totalScore: "160",
    challenges: [
      { score: "750", time: "00:08" },
      { score: "180", time: "00:08" },
      { score: "450", time: "00:08" },
      { score: "230", time: "00:08" },
    ],
    isHighlighted: true,
  },
  {
    rank: "2",
    teamName: "Team Beta",
    totalScore: "210",
    challenges: [
      { score: "650", time: "00:08" },
      { score: "150", time: "00:08" },
      { score: "440", time: "00:08" },
      { score: "230", time: "00:08" },
    ],
    isHighlighted: true,
  },
  {
    rank: "3",
    teamName: "Team Theta",
    totalScore: "350",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      { score: "240", time: "00:08" },
      null,
    ],
    isHighlighted: true,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
  {
    rank: "4",
    teamName: "Team Gamma",
    totalScore: "550",
    challenges: [
      { score: "450", time: "00:08" },
      { score: "350", time: "00:08" },
      null,
      null,
    ],
    isHighlighted: false,
  },
];

export default function ScoreTable() {
  const cellBaseClass =
    "px-1 py-2 md:px-4 md:py-3 text-center align-middle border-b border-black/30 whitespace-nowrap";
  const fontMainClass = " font-normal tracking-[0] leading-tight";

  return (
    <div
      className={`
      ${im_fell.className} 
      relative w-full lg:max-w-[1860px] mx-auto mt-10
    `}
    >
      <div
        aria-hidden="true"
        className="
          absolute top-2 md:top-0 left-0 right-0
          h-20 md:h-30 /* RESPONSIVE: Shorter height on mobile */
          [background-image:url('/leaderboard/wood.png')] 
          bg-[size:100%_100%]
          bg-center z-10 bg-no-repeat
        "
      />

      <div className="relative mx-auto w-[85%] lg:max-w-[1600px]">
        <div
          aria-hidden="true"
          className="
            absolute left-0 right-0 bottom-0
            top-16 md:top-20 /* RESPONSIVE: Smaller overlap on mobile */
            [background-image:url('/leaderboard/paper-bg.png')] 
            bg-cover bg-no-repeat bg-bottom
            z-0
          "
        />

        <div className="relative z-20 px-2 md:px-10">
          <table className="min-w-full table-fixed border-collapse">
            <thead
              className="
                h-24 md:h-30 /* RESPONSIVE: Match wood height */
                bg-transparent
              "
            >
              <tr>
                <th
                  className={`w-[10%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  RANK
                </th>
                <th
                  className={`w-[25%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  TEAM
                </th>
                <th
                  className={`w-[20%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  PENALTY TIME
                </th>
                <th
                  className={`w-[11.25%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  A
                </th>
                <th
                  className={`w-[11.25%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  B
                </th>
                <th
                  className={`w-[11.25%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  C
                </th>
                <th
                  className={`w-[11.25%] ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                >
                  D
                </th>
              </tr>
            </thead>

            <tbody
              className="
                bg-transparent
              "
            >
              {tableData.map((entry, index) => (
                <tr key={`leaderboard-row-${index}`} className="">
                  <td
                    className={`
                      ${cellBaseClass} ${fontMainClass} 
                      text-base md:text-2xl /* RESPONSIVE: Smaller text */
                      ${
                        entry.isHighlighted
                          ? "text-[#ff5900]"
                          : "text-[#2f2f2f]"
                      }
                    `}
                  >
                    {entry.rank}
                  </td>

                  <td
                    className={`
                      ${cellBaseClass} ${fontMainClass} 
                      text-base md:text-2xl /* RESPONSIVE: Smaller text */
                      ${
                        entry.isHighlighted
                          ? "text-[#ff5900]"
                          : "text-[#2f2f2f]"
                      }
                    `}
                  >
                    {entry.teamName}
                  </td>

                  <td
                    className={`
                      ${cellBaseClass} ${fontMainClass} 
                      text-base md:text-2xl /* RESPONSIVE: Smaller text */
                      ${
                        entry.isHighlighted
                          ? "text-[#ff5900]"
                          : "text-[#2f2f2f]"
                      }
                    `}
                  >
                    {entry.totalScore}
                  </td>

                  {entry.challenges.map((challenge, challengeIndex) => (
                    <td
                      key={`challenge-${index}-${challengeIndex}`}
                      className={`${cellBaseClass} leading-none`}
                    >
                      {challenge ? (
                        <div className="flex flex-col">
                          <span
                            className={`
                              ${fontMainClass} 
                              text-base md:text-2xl /* RESPONSIVE: Smaller text */
                              ${
                                entry.isHighlighted
                                  ? "text-[#ff5900]"
                                  : "text-[#2f2f2f]"
                              }
                            `}
                          >
                            {challenge.score}
                          </span>
                          <span
                            className={`
                              ${fontMainClass} 
                              text-[10px] md:text-sm /* RESPONSIVE: Smaller text */
                              ${
                                entry.isHighlighted
                                  ? "text-[#906868]"
                                  : "text-[#515151]"
                              }
                            `}
                          >
                            {challenge.time}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`
                            ${fontMainClass} 
                            text-base md:text-2xl /* RESPONSIVE: Smaller text */
                            ${
                              entry.isHighlighted
                                ? "text-[#ff5900]"
                                : "text-[#2f2f2f]"
                            }
                          `}
                        >
                          -
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
