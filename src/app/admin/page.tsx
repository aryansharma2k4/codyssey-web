import LeaderboardAdmin from '@/components/admin/Admin';

// Define a type for the data we expect from our API
// This should match the structure of your /api/getStandings response
interface StandingsResponse {
  standings: {
    contest: {
      name: string;
    };
    rows: Array<{
      party: {
        members: Array<{ handle: string }>;
        teamId?: number;
        participantId: number;
        teamName?: string;
      };
      rank: number;
      points: number;
      penalty: number;
    }>;
  };
}

// This function fetches data on the server
async function getLeaderboardData(): Promise<StandingsResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const response = await fetch(`${baseUrl}/api/getStandings`, {
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to load admin data:", error);
    return null;
  }
}

// This is the default export for the page
export default async function AdminPage() {
  
  const data = await getLeaderboardData();

  if (!data) {
    return (
      <main className="p-5">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p className="text-gray-700">
          Could not load leaderboard data. Please check your API endpoint.
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* Pass the data to the client component */}
      <LeaderboardAdmin apiResponse={data} />
    </main>
  );
}