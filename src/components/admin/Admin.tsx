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
  
  // State for the custom modal
  const [modal, setModal] = useState({ 
    isOpen: false, 
    message: '', 
    onConfirm: null as (() => void) | null // Function to run on confirm
  });

  if (!apiResponse || !apiResponse.standings) {
    return <div className="p-5">Loading leaderboard...</div>;
  }

  const { contest, rows } = apiResponse.standings;

  const handleStartContest = async () => {
    if (!contestId) {
      setModal({ isOpen: true, message: 'Please enter a Contest ID.', onConfirm: null });
      return;
    }
    console.log(`Starting contest ${contestId}`);
    try {
      await fetch('/api/startContest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId: contestId }),
      });
      setModal({ isOpen: true, message: `Contest ${contestId} has been started!`, onConfirm: null });
    } catch (error) {
      console.error('Failed to start contest:', error);
      setModal({ isOpen: true, message: `Failed to start contest ${contestId}.`, onConfirm: null });
    }
  };

  /**
   * --- CORRECTED FUNCTION ---
   * Handles downloading the CSV file from the API
   * Now sends a GET request with contestId as a URL parameter
   */
  const handleDownloadCsv = async () => {
    // Check for contestId first
    if (!contestId) {
      setModal({ isOpen: true, message: 'Please enter a Contest ID before downloading.', onConfirm: null });
      return;
    }

    console.log(`Downloading CSV for contest ${contestId}...`);
    try {
      // Changed to GET and added contestId as a query parameter
      const response = await fetch(`/api/downloadCsv?contestId=${contestId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      // Get the blob data from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Sanitize contest name for a dynamic filename
      // Use the contest name from the API response if available, otherwise default
      const contestName = apiResponse?.standings?.contest?.name || 'contest';
      const fileName = contestName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `${fileName || 'standings'}.csv`;
      
      // Add link to body, click it, and then remove it
      document.body.appendChild(a);
      a.click();
      
      // Clean up the temporary URL and link
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Failed to download CSV:', error);
      // Use the modal to show errors
      setModal({ isOpen: true, message: `Failed to download CSV. ${(error as Error).message}`, onConfirm: null });
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
      setModal({ isOpen: true, message: `Bonus added for ${handle}!`, onConfirm: null });
    } catch (error) {
      console.error('Failed to add bonus:', error);
      setModal({ isOpen: true, message: `Failed to add bonus for ${handle}.`, onConfirm: null });
    }
  };

  const handleBan = (teamId: number, handle: string) => {
    setModal({
      isOpen: true,
      message: `Are you sure you want to ban ${handle}?`,
      onConfirm: async () => {
        // This logic runs only if the user clicks "Confirm"
        console.log(`Banning team ${teamId} (${handle})`);
        try {
          await fetch('/api/setStand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'BAN_USER',
              teamId: teamId,
              handle: handle,
            }),
          });
          setModal({ isOpen: true, message: `${handle} has been banned.`, onConfirm: null });
        } catch (error) {
          console.error('Failed to ban user:', error);
          setModal({ isOpen: true, message: `Failed to ban ${handle}.`, onConfirm: null });
        }
      }
    });
  };

  // Helper to close the modal
  const closeModal = () => {
    setModal({ isOpen: false, message: '', onConfirm: null });
  };
  
  // Helper to confirm action in modal
  const confirmModal = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  return (
    <div className="font-sans max-w-5xl mx-auto my-5 p-5 bg-white">
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <label htmlFor="contestId" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Contest ID
        </label>
        <div className="flex flex-wrap gap-4">
          {/* THIS IS THE INPUT BOX LOGIC. CHECK THIS CAREFULLY. */}
          <input
            type="text"
            id="contestId"
            value={contestId} // The value is tied to the state
            onChange={(e) => setContestId(e.target.value)} // This updates the state on every keystroke
            placeholder="e.g., 123456"
            className="flex-grow p-2 border border-gray-300 rounded-md text-black min-w-[200px]"
          />
          <button
            onClick={handleStartContest}
            className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Contest
          </button>
          
          {/* --- NEW BUTTON ADDED --- */}
          <button
            onClick={handleDownloadCsv}
            className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-green-600 hover:bg-green-700"
          >
            Download List
          </button>
          {/* --- END OF NEW BUTTON --- */}

        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">{contest.name} - Admin Panel</h2> 

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white min-w-[600px]">
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
                    <div className="flex gap-2 justify-center flex-wrap">
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

      {/* --- NEW CUSTOM MODAL --- */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <p className="text-gray-800 mb-4 text-base">{modal.message}</p>
            <div className="flex justify-end gap-3">
              {/* If onConfirm exists, it's a confirmation dialog */}
              {modal.onConfirm && (
                <button
                  onClick={confirmModal}
                  className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
                >
                  Confirm
                </button>
              )}
              <button
                onClick={closeModal}
                className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                {/* Show "Cancel" for confirmation, "OK" for simple alert */}
                {modal.onConfirm ? 'Cancel' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END OF CUSTOM MODAL --- */}

    </div>
  );
}

