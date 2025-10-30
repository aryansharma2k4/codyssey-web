import { Griffy, Hubot_Sans } from "next/font/google";
import Podium from "./Podium";
import { StandingsData } from "@/lib/types"; // Import type

const hubot_sans = Hubot_Sans();
const griffy = Griffy({
  weight: "400",
});

// Define props
interface HeroContentProps {
  standings: StandingsData | null;
}

// Mock images, as these aren't in the API response
const podiumImages = [
  "/leaderboard/vector-1.png",
  "/leaderboard/vector-2.png",
  "/leaderboard/vector-3.png",
];

export default function HeroContent({ standings }: HeroContentProps) {
  
  // Create podium data from standings
  const topThree = standings?.rows.slice(0, 3).map((row, index) => ({
    team: row.party.teamName || `Team ${row.party.members[0]?.handle || 'N/A'}`,
    image: podiumImages[index] || "/leaderboard/vector-1.png", // Fallback image
  })) || [];

  // Ensure we always have 3 items for the podium component, even if loading
  const podiumData: [any, any, any] = [
    topThree[0] || { team: "Loading...", image: podiumImages[0] },
    topThree[1] || { team: "Loading...", image: podiumImages[1] },
    topThree[2] || { team: "Loading...", image: podiumImages[2] },
  ];

  return (
    <div className={`${hubot_sans.className} flex flex-col select-none mt-30`}>
      {/* Dynamic Contest Name */}
      <h1 className="font-extrabold text-5xl md:text-6xl uppercase">
        {standings?.contest.name || "LOADING..."}
      </h1>

      <button
        className={`${griffy.className} bg-[linear-gradient(0deg,#E54807,#E54807),radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0)_25.96%,rgba(0,0,0,0.45)_96.15%)] text-[shadow:2px_2px_4px_rgba(0,0,0,0.5)] px-25 py-5 mt-8 rounded-3xl text-5xl font-medium self-center tracking-wider`}
      >
        LEADERBOARD
      </button>

      {/* Pass dynamic data to Podium */}
      <Podium topThree={podiumData} />
    </div>
  );
}
