import { Griffy, Hubot_Sans } from "next/font/google";
import Podium from "./Podium";

const hubot_sans = Hubot_Sans();

const griffy = Griffy({
  weight: "400",
});

export default function HeroContent() {
  return (
    <div className={`${hubot_sans.className} flex flex-col select-none mt-30`}>
      <h1 className="font-extrabold text-5xl md:text-6xl">CODYSSEY’ 25</h1>

      <button
        className={`${griffy.className} bg-[linear-gradient(0deg,#E54807,#E54807),radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0)_25.96%,rgba(0,0,0,0.45)_96.15%)] text-[shadow:2px_2px_4px_rgba(0,0,0,0.5)] px-25 py-5 mt-8 rounded-3xl text-5xl font-medium self-center  tracking-wider`}
      >
        LEADERBOARD
      </button>
      <Podium
        topThree={[
          { team: "Team Alpha", image: "/leaderboard/vector-1.png" },
          { team: "Team Beta", image: "/leaderboard/vector-2.png" },
          { team: "Team Gamma", image: "/leaderboard/vector-3.png" },
        ]}
      />
    </div>
  );
}
