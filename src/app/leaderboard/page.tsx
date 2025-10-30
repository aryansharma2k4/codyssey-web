'use client';

import { useState, useEffect } from 'react';
import HeroSection from "@/components/leaderboard/HeroSection";
import ScoreTable from "@/components/leaderboard/ScoreTable";
import { StandingsData, ApiResponse } from '@/lib/types'; // Make sure ApiResponse includes lastUpdatedAt

export default function Page() {
  const [standings, setStandings] = useState<StandingsData | null>(null);
  // --- ADDED STATE ---
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getStandings'); 
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: ApiResponse = await response.json(); // Assuming ApiResponse has { standings: ..., lastUpdatedAt: ... }
        
        // --- MODIFIED LOGIC ---
        if (data) {
          setStandings(data.standings || null);
          setLastUpdatedAt(data.lastUpdatedAt || null); // <-- ADDED
        } else {
          throw new Error("No data found in API response");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []); 

  if (error) {
    return <div className="bg-black text-white min-h-screen text-center p-10">Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="bg-black">
      {/* --- MODIFIED COMPONENT --- */}
      <HeroSection standings={standings} lastUpdatedAt={lastUpdatedAt} />
      <ScoreTable 
        problems={standings?.problems || []} 
        rows={standings?.rows || []} 
      />
      <div className="h-20"/>
    </div>
  );
}