import HeroSection from "@/components/leaderboard/HeroSection";
import ScoreTable from "@/components/leaderboard/ScoreTable";

export default function Page() {
  return (
    <div className="bg-black">
      <HeroSection />
      <ScoreTable />
      <div className="h-20"/>
    </div>
  );
}
