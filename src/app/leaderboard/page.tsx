'use client';

import { useState, useEffect } from 'react';
import HeroSection from "@/components/leaderboard/HeroSection";
import ScoreTable from "@/components/leaderboard/ScoreTable";
import { StandingsData, ApiResponse } from '@/lib/types'; 

export default function Page() {
  const [standings, setStandings] = useState<StandingsData | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bannedTeams, setBannedTeams] = useState<string[]>([]);
  
  // --- ADDED STATE FOR BONUSES ---
  const [bonuses, setBonuses] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- MODIFIED: Fetch standings, banlist, and bonuses in parallel ---
        const [standingsResponse, banlistResponse, bonusResponse] = await Promise.all([
          fetch('/api/getStandings'),
          fetch('/api/showBanList'), // Corrected path
          fetch('/api/showBonus')    // <-- Fetch bonuses
        ]);

        if (!standingsResponse.ok) {
          throw new Error(`Failed to fetch standings: ${standingsResponse.statusText}`);
        }
        if (!banlistResponse.ok) {
          throw new Error(`Failed to fetch banlist: ${banlistResponse.statusText}`);
        }
        if (!bonusResponse.ok) {
          throw new Error(`Failed to fetch bonuses: ${bonusResponse.statusText}`);
        }

        const standingsData: ApiResponse = await standingsResponse.json();
        const banlistData = await banlistResponse.json();
        const bonusData = await bonusResponse.json(); // <-- Get bonus JSON

        // --- Set Standings ---
        if (standingsData) {
          setStandings(standingsData.standings || null);
          setLastUpdatedAt(standingsData.lastUpdatedAt || null);
        } else {
          throw new Error("No data found in standings API response");
        }

        // --- Set Banlist ---
        if (banlistData && banlistData.success) {
          setBannedTeams(banlistData.bannedTeams || []); 
        } else {
          console.error("Failed to parse banlist:", banlistData.error);
          setBannedTeams([]); 
        }

        // --- SET BONUSES ---
        if (bonusData && bonusData.success) {
          // Convert string values from Redis to numbers
          const parsedBonuses: Record<string, number> = {};
          if (bonusData.bonuses) {
            for (const team in bonusData.bonuses) {
              parsedBonuses[team] = parseInt(bonusData.bonuses[team], 10) || 0;
            }
          }
          setBonuses(parsedBonuses);
        } else {
          console.error("Failed to parse bonuses:", bonusData.error);
          setBonuses({});
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 40000); // Your interval
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
        bannedTeams={bannedTeams}
        bonuses={bonuses} // <-- PASS BONUSES AS PROP
      />
      <div className="h-20"/>
    </div>
  );
}