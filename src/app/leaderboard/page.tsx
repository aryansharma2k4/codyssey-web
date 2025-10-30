'use client';

import { useState, useEffect } from 'react';
import HeroSection from "@/components/leaderboard/HeroSection";
import ScoreTable from "@/components/leaderboard/ScoreTable";
import { StandingsData, ApiResponse } from '@/lib/types'; // Import our new types

export default function Page() {
  const [standings, setStandings] = useState<StandingsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API route
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getStandings'); // Your GET route
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: ApiResponse = await response.json();
        
        if (data && data.standings) {
          setStandings(data.standings);
        } else {
          throw new Error("No standings data found in API response");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchData();

    // Set up polling to refresh data every 10 seconds (matching your cache)
    const interval = setInterval(fetchData, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);

  }, []); // Empty dependency array means this runs once on mount

  // Show loading or error states
  if (error) {
    return <div className="bg-black text-white min-h-screen text-center p-10">Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="bg-black">
      {/* Pass the fetched data down to the children */}
      <HeroSection standings={standings} />
      <ScoreTable 
        problems={standings?.problems || []} 
        rows={standings?.rows || []} 
      />
      <div className="h-20"/>
    </div>
  );
}
