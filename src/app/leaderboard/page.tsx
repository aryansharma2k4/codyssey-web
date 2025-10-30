'use client';

import { useState, useEffect } from 'react';
import HeroSection from "@/components/leaderboard/HeroSection";
import ScoreTable from "@/components/leaderboard/ScoreTable";
import { StandingsData, ApiResponse } from '@/lib/types'; 

export default function Page() {
  const [standings, setStandings] = useState<StandingsData | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // --- ADDED STATE FOR BANLIST ---
  const [bannedTeams, setBannedTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- MODIFIED: Fetch standings and banlist in parallel ---
        const [standingsResponse, banlistResponse] = await Promise.all([
          fetch('/api/getStandings'),
          fetch('/api/banList') // <-- Fetch banlist
        ]);

        if (!standingsResponse.ok) {
          throw new Error(`Failed to fetch standings: ${standingsResponse.statusText}`);
        }
        if (!banlistResponse.ok) {
          throw new Error(`Failed to fetch banlist: ${banlistResponse.statusText}`);
        }

        const standingsData: ApiResponse = await standingsResponse.json();
        const banlistData = await banlistResponse.json(); // <-- Get banlist JSON

        // --- MODIFIED: Set both standings and banlist state ---
        if (standingsData) {
          setStandings(standingsData.standings || null);
          setLastUpdatedAt(standingsData.lastUpdatedAt || null);
        } else {
          throw new Error("No data found in standings API response");
        }

        if (banlistData && banlistData.success) {
          setBannedTeams(banlistData.bannedTeams || []); // <-- Set banlist
        } else {
          console.error("Failed to parse banlist:", banlistData.error);
          setBannedTeams([]); // Set to empty on failure
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 40000);
    return () => clearInterval(interval);
  }, []); 

  if (error) {
    return <div className="bg-black text-white min-h-screen text-center p-10">Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="bg-black">
      <HeroSection standings={standings} lastUpdatedAt={lastUpdatedAt} />
      <ScoreTable 
        problems={standings?.problems || []} 
        rows={standings?.rows || []} 
        bannedTeams={bannedTeams} // <-- PASS BANLIST AS PROP
      />
      <div className="h-20"/>
    </div>
  );
}