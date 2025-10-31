'use client';

import { IM_Fell_English_SC } from "next/font/google";
import { useState } from "react"
import { Problem, Row } from "../../lib/types"; // Assuming path is ../../lib/types

const im_fell = IM_Fell_English_SC({
  weight: "400",
});

// --- MODIFIED PROPS ---
interface ScoreTableProps {
  problems: Problem[];
  rows: Row[];
  bannedTeams: string[];
  bonuses: Record<string, number>; // <-- ADDED PROP
}

export default function ScoreTable({ problems, rows, bannedTeams, bonuses }: ScoreTableProps) {
  const cellBaseClass =
    "px-2 py-2 md:px-4 md:py-3 text-center align-middle border-b border-black/30 whitespace-nowrap";
  const fontMainClass = " font-normal tracking-[0] leading-tight";

  // --- ADJUSTED WIDTHS ---
  
  const rankWidth = 10;
  const teamWidth = 30;
  const penaltyWidth = 15; // Reduced
  const bonusWidth = 10;     // <-- NEW
  const problemColWidth = problems.length > 0 
    ? (100 - rankWidth - teamWidth - penaltyWidth - bonusWidth) / problems.length 
    : (100 - rankWidth - teamWidth - penaltyWidth - bonusWidth);


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
          h-20 md:h-30 
          [background-image:url('/leaderboard/wood.png')] 
          bg-[size:100%_100%]
          bg-center z-10 bg-no-repeat
        "
      />

      <div className="relative mx-auto w-[90%] md:w-[85%] lg:max-w-[1600px]">
        <div
          aria-hidden="true"
          className="
            absolute left-0 right-0 bottom-0
            top-16 md:top-20 
            [background-image:url('/leaderboard/paper-bg.png')] 
            bg-cover bg-no-repeat bg-bottom
            z-0
          "
        />

        <div className="relative z-20 px-2 md:px-10 overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed border-collapse">
            <thead
              className="
                h-24 md:h-30 
                bg-transparent
              "
            >
              <tr>
                <th
                  className={`${fontMainClass} text-[10px] sm:text-xs md:text-xl text-white pt-1 md:pt-2`}
                  style={{ width: `${rankWidth}%` }} 
                >
                  RANK
                </th>
                <th
                  className={`${fontMainClass} text-[10px] sm:text-xs md:text-xl text-white pt-1 md:pt-2`}
                  style={{ width: `${teamWidth}%` }} 
                >
                  TEAM
                </th>
                <th
                  className={`${fontMainClass} text-[10px] sm:text-xs md:text-xl text-white pt-1 md:pt-2`}
                  style={{ width: `${penaltyWidth}%` }} // Adjusted width
                >
                  PENALTY TIME
                </th>
                
                {/* --- NEW HEADER --- */}
                <th
                  className={`${fontMainClass} text-[10px] sm:text-xs md:text-xl text-white pt-1 md:pt-2`}
                  style={{ width: `${bonusWidth}%` }} 
                >
                  BONUS
                </th>
                {/* --- END NEW HEADER --- */}

                {problems.map((problem) => (
                  <th
                    key={problem.index}
                    className={`${fontMainClass} text-[10px] sm:text-xs md:text-xl text-white pt-1 md:pt-2`}
                    style={{ width: `${problemColWidth}%` }}
                  >
                    {problem.index}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-transparent">
              {rows.map((row, index) => {
                const isHighlighted = row.rank <= 3;
                
                const teamName = row.party.teamName || row.party.members[0]?.handle || 'N/A';
                const isBanned = bannedTeams.includes(teamName);
                
                // --- GET BONUS ---
                const bonusPoints = bonuses[teamName] || 0;

                return (
                  <tr key={`leaderboard-row-${index}`} className="">
                    <td
                      className={`
                        ${cellBaseClass} ${fontMainClass} 
                        text-sm sm:text-base md:text-2xl
                        ${
                          isBanned 
                            ? "text-gray-400"
                            : isHighlighted
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
                        text-sm sm:text-base md:text-2xl 
                        truncate 
                        ${
                          isBanned
                            ? "text-gray-400"
                            : isHighlighted
                            ? "text-[#ff5900]"
                            : "text-[#2f2f2f]"
                        }
                      `}
                    >
                      {teamName}
                    </td>

                    <td
                      className={`
                        ${cellBaseClass} ${fontMainClass} 
                        text-sm sm:text-base md:text-2xl 
                        ${
                          isBanned
                            ? "text-gray-400"
                            : isHighlighted
                            ? "text-[#ff5900]"
                            : "text-[#2f2f2f]"
                        }
                      `}
                    >
                      {row.penalty}
                    </td>
                    
                    {/* --- NEW BONUS CELL --- */}
                    <td
                      className={`
                        ${cellBaseClass} ${fontMainClass} 
                        text-sm sm:text-base md:text-2xl 
                        ${
                          isBanned
                            ? "text-gray-400"
                            : bonusPoints < 0 ? "text-red-500" : "text-green-500" 
                        }
                      `}
                    >
                      {/* Show bonus if it's not zero */}
                      {bonusPoints}
                    </td>
                    {/* --- END NEW BONUS CELL --- */}    
                    
                    {row.problemResults.map((pr, challengeIndex) => (
                      <td
                        key={`challenge-${index}-${challengeIndex}`}
                        className={`${cellBaseClass} leading-none`}
                      >
                        {pr.points > 0 ? (
                          <div className="flex flex-col">
                            <span
                              className={`
                                ${fontMainClass} 
                                text-sm sm:text-base md:text-2xl 
                                ${
                                  isBanned
                                    ? "text-gray-400"
                                    : isHighlighted
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
                                text-[9px] sm:text-[10px] md:text-sm 
                                ${
                                  isBanned
                                    ? "text-gray-400"
                                    : isHighlighted
                                    ? "text-[#906868]"
                                    : "text-[#515151]"
                                }
                              `}
                            >
                              ({pr.rejectedAttemptCount})
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`
                              ${fontMainClass} 
                              text-sm sm:text-base md:text-2xl 
                              ${
                                isBanned
                                  ? "text-gray-400"
                                  : isHighlighted
                                  ? "text-gray-400"
                                  : "text-[#2f2f2f]"
                              }
                            `}
                          >
                            {pr.rejectedAttemptCount > 0 ? `-${pr.rejectedAttemptCount}` : '-'}
                          </div>
                        )}
                      </td>
                    ))}
                    
                    {/* Empty cells */}
                    {Array.from({ length: problems.length - row.problemResults.length }).map((_, i) => (
                        <td key={`empty-challenge-${index}-${i}`} className={`${cellBaseClass}`}>
                          <div
                            className={`
                              ${fontMainClass} 
                              text-sm sm:text-base md:text-2xl 
                              ${
                                isBanned
                                  ? "text-gray-400"
                                  : isHighlighted
                                  ? "text-[#ff5900]"
                                  : "text-[#2f2f2f]"
                              }
                            `}
                          >
                            -
                          </div>
                        </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="text-center text-lg md:text-xl text-[#2f2f2f] py-20">
              Leaderboard is empty. The contest may not have started yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}