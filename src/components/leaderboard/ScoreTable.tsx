'use client';

import { IM_Fell_English_SC } from "next/font/google";
import { Problem, Row } from "@/lib/types"; // Import our types

const im_fell = IM_Fell_English_SC({
  weight: "400",
});

// Define component props
interface ScoreTableProps {
  problems: Problem[];
  rows: Row[];
}

export default function ScoreTable({ problems, rows }: ScoreTableProps) {
  const cellBaseClass =
    "px-1 py-2 md:px-4 md:py-3 text-center align-middle border-b border-black/30 whitespace-nowrap";
  const fontMainClass = " font-normal tracking-[0] leading-tight";

  // Calculate widths dynamically based on number of problems
  const problemColWidth = problems.length > 0 ? (100 - 10 - 25 - 20) / problems.length : 45;
  const problemWidthClass = `w-[${problemColWidth.toFixed(2)}%]`;


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
                
                {/* --- DYNAMIC PROBLEM HEADERS --- */}
                {problems.map((problem) => (
                  <th
                    key={problem.index}
                    className={`${problemWidthClass} ${fontMainClass} text-xs md:text-xl text-white pt-1 md:pt-2`}
                    style={{ width: `${problemColWidth}%` }} // Inline style fallback for dynamic width
                  >
                    {problem.index}
                  </th>
                ))}
                {/* --- END DYNAMIC HEADERS --- */}

              </tr>
            </thead>

            <tbody
              className="
                bg-transparent
              "
            >
              {/* --- DYNAMIC ROWS --- */}
              {rows.map((row, index) => {
                // Highlight top 3
                const isHighlighted = row.rank <= 3;
                
                return (
                  <tr key={`leaderboard-row-${index}`} className="">
                    <td
                      className={`
                        ${cellBaseClass} ${fontMainClass} 
                        text-base md:text-2xl 
                        ${
                          isHighlighted
                            ? "text-[#ff5900]"
                            : "text-[#2f2f2f]"
                        }
                      `}
                    >
                      {row.rank}
                    </td>

                    <td
                      className={`
                        ${cellBaseClass} ${fontMainClass} 
                        text-base md:text-2xl 
                        ${
                          isHighlighted
                            ? "text-[#ff5900]"
                            : "text-[#2f2f2f]"
                        }
                      `}
                    >
                      {row.party.teamName || row.party.members[0]?.handle || 'N/A'}
                    </td>

                    <td
                      className={`
                        ${cellBaseClass} ${fontMainClass} 
                        text-base md:text-2xl
                        ${
                          isHighlighted
                            ? "text-[#ff5900]"
                            : "text-[#2f2f2f]"
                        }
                      `}
                    >
                      {/* Display Penalty Time */}
                      {row.penalty}
                    </td>
                    
                    {/* --- DYNAMIC PROBLEM CELLS --- */}
                    {row.problemResults.map((pr, challengeIndex) => (
                      <td
                        key={`challenge-${index}-${challengeIndex}`}
                        className={`${cellBaseClass} leading-none`}
                      >
                        {/* Display if points > 0, otherwise show '-' */}
                        {pr.points > 0 ? (
                          <div className="flex flex-col">
                            <span
                              className={`
                                ${fontMainClass} 
                                text-base md:text-2xl 
                                ${
                                  isHighlighted
                                    ? "text-[#ff5900]"
                                    : "text-[#2f2f2f]"
                                }
                              `}
                            >
                              {pr.points}
                            </span>
                            <span
                              className={`
                                ${fontMainClass} 
                                text-[10px] md:text-sm 
                                ${
                                  isHighlighted
                                    ? "text-[#906868]"
                                    : "text-[#515151]"
                                }
                              `}
                            >
                              {/* Show attempt count */}
                              ({pr.rejectedAttemptCount})
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`
                              ${fontMainClass} 
                              text-base md:text-2xl 
                              ${
                                isHighlighted
                                  ? "text-[#ff5900]"
                                  : "text-[#2f2f2f]"
                              }
                            `}
                          >
                            {/* Show 0 attempts or '-' */}
                            {pr.rejectedAttemptCount > 0 ? `(${pr.rejectedAttemptCount})` : '-'}
                          </div>
                        )}
                      </td>
                    ))}
                    {/* Handle cases where a team has fewer results than problems */}
                    {Array.from({ length: problems.length - row.problemResults.length }).map((_, i) => (
                       <td key={`empty-challenge-${index}-${i}`} className={`${cellBaseClass}`}>
                         <div
                            className={`
                              ${fontMainClass} 
                              text-base md:text-2xl 
                              ${
                                isHighlighted
                                  ? "text-[#ff5900]"
                                  : "text-[#2f2f2f]"
                              }
                            `}
                          >
                            -
                          </div>
                       </td>
                    ))}
                    {/* --- END DYNAMIC CELLS --- */}

                  </tr>
                );
              })}
              {/* --- END DYNAMIC ROWS --- */}
            </tbody>
          </table>
          {/* Show message if table is empty */}
          {rows.length === 0 && (
            <div className="text-center text-xl text-[#2f2f2f] py-20">
              Leaderboard is empty. The contest may not have started yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
