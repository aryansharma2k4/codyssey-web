'use client';

// Make sure you import useState
import { useState } from 'react';

// Define the types for the props this component receives
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

interface LeaderboardAdminProps {
  apiResponse: StandingsResponse | null;
}

// This is your client component
export default function LeaderboardAdmin({ apiResponse }: LeaderboardAdminProps) {
  // THIS IS THE STATE THAT CONTROLS THE INPUT BOX
  const [contestId, setContestId] = useState<string>('');

  if (!apiResponse || !apiResponse.standings) {
    return <div className="p-5">Loading leaderboard...</div>;
  }

  const { contest, rows } = apiResponse.standings;

  const handleStartContest = async () => {
    if (!contestId) {
      alert('Please enter a Contest ID.');
      return;
    }
    console.log(`Starting contest ${contestId}`);
    try {
      await fetch('/api/startContest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId: contestId }),
      });
      alert(`Contest ${contestId} has been started!`);
    } catch (error) {
      console.error('Failed to start contest:', error);
      alert(`Failed to start contest ${contestId}.`);
    }
  };

  const handleAddBonus = async (teamId: number, handle: string) => {
    console.log(`Adding bonus for team ${teamId} (${handle})`);
    try {
      await fetch('/api/setStandings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_BONUS',
          teamId: teamId,
          handle: handle,
        }),
      });
      alert(`Bonus added for ${handle}!`);
    } catch (error) {
      console.error('Failed to add bonus:', error);
      alert(`Failed to add bonus for ${handle}.`);
    }
  };

  const handleBan = async (teamId: number, handle: string) => {
    if (!confirm(`Are you sure you want to ban ${handle}?`)) {
      return;
    }
    console.log(`Banning team ${teamId} (${handle})`);
    try {
      await fetch('/api/setStandings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BAN_USER',
          teamId: teamId,
          handle: handle,
        }),
      });
      alert(`${handle} has been banned.`);
    } catch (error) {
      console.error('Failed to ban user:', error);
      alert(`Failed to ban ${handle}.`);
    }
  };

  return (
    <div className="font-sans max-w-5xl mx-auto my-5 p-5 bg-white">
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <label htmlFor="contestId" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Contest ID
        </label>
        <div className="flex gap-4">
          {/* THIS IS THE INPUT BOX LOGIC. CHECK THIS CAREFULLY. */}
          <input
            type="text"
            id="contestId"
            value={contestId} // The value is tied to the state
            onChange={(e) => setContestId(e.target.value)} // This updates the state on every keystroke
            placeholder="e.g., 123456"
            className="flex-grow p-2 border border-gray-300 rounded-md text-black"
          />
          <button
            onClick={handleStartContest}
            className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Contest
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">{contest.name} - Admin Panel</h2> 

      <table className="w-full border-collapse bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Rank</th>
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Team Name</th>
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Handle</th>
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Points</th>
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Penalty</th>
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {rows.map((row) => {
            const team = row.party;
            const handle = team.members[0]?.handle || 'N/A';
            const teamId = team.teamId || team.participantId;

            return (
              <tr key={teamId} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{row.rank}</td>
                <td className="border border-gray-300 p-3">{team.teamName || '(No Team Name)'}</td>
                <td className="border border-gray-300 p-3">{handle}</td>
                <td className="border border-gray-300 p-3">{row.points}</td>
                <td className="border border-gray-300 p-3">{row.penalty}</td>
                <td className="border border-gray-300 p-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="py-1 px-3 text-sm font-medium border border-gray-300 rounded cursor-pointer transition-colors bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleAddBonus(teamId, handle)}
                    >
                      Add Bonus
                    </button>
                    <button
                      className="py-1 px-3 text-sm font-medium border border-gray-300 rounded cursor-pointer transition-colors text-white bg-red-600 hover:bg-red-700"
                      onClick={() => handleBan(teamId, handle)}
                    >
                      Ban
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}