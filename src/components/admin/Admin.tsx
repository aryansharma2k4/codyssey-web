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
  // THIS IS THE STATE THAT CONTROLS THE INPUT BOXES
  const [contestId, setContestId] = useState<string>('');
  const [contestName, setContestName] = useState<string>('');
  const [contestLink, setContestLink] = useState<string>('');
  
  // State for the main confirmation/alert modal
  const [modal, setModal] = useState({ 
    isOpen: false, 
    message: '', 
    onConfirm: null as (() => void) | null 
  });

  // --- NEW STATE for the bonus input modal ---
  const [bonusModal, setBonusModal] = useState({ 
    isOpen: false, 
    teamName: '', 
    points: '' 
  });

  if (!apiResponse || !apiResponse.standings) {
    return (
      <div className="p-5 bg-white max-w-5xl mx-auto my-5 rounded-md shadow">
        Loading leaderboard...
      </div>
    );
  }

  const { contest, rows } = apiResponse.standings;

  /**
   * --- (Unchanged function) ---
   * Handles starting the contest
   */
  const handleStartContest = async () => {
    if (!contestId || !contestName || !contestLink) {
      setModal({ isOpen: true, message: 'Please fill in Contest ID, Contest Name, and Contest Link.', onConfirm: null });
      return;
    }
    
    console.log(`Starting contest ${contestId} (${contestName}) at ${contestLink}`);
    
    try {
      const response = await fetch('/api/setContest', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'START_CONTEST', 
          contestId: contestId,
          contestName: contestName,
          contestLink: contestLink
        }),
      });

      const data = await response.json(); 

      if (response.ok) {
        setModal({ isOpen: true, message: `Success! Status: ${response.status} ${response.statusText}`, onConfirm: null });
      } else {
        throw new Error(data.error || `Failed to start contest. Status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Failed to start contest:', error);
      setModal({ isOpen: true, message: `Failed to start contest: ${(error as Error).message}`, onConfirm: null });
    }
  };

  /**
   * --- (Unchanged function) ---
   * Handles downloading the CSV file from the API
   */
  const handleDownloadCsv = async () => {
    if (!contestId) {
      setModal({ isOpen: true, message: 'Please enter a Contest ID before downloading.', onConfirm: null });
      return;
    }

    console.log(`Downloading CSV for contest ${contestId}...`);
    try {
      const response = await fetch(`/api/downloadCsv?contestId=${contestId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const contestNameApi = apiResponse?.standings?.contest?.name || 'contest';
      const fileName = contestNameApi.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `${fileName || 'standings'}.csv`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Failed to download CSV:', error);
      setModal({ isOpen: true, message: `Failed to download CSV. ${(error as Error).message}`, onConfirm: null });
    }
  };

  /**
   * --- MODIFIED FUNCTION ---
   * Opens the bonus modal
   */
  const handleAddBonus = (teamName: string) => {
    setBonusModal({ isOpen: true, teamName: teamName, points: '' });
  };

  /**
   * --- NEW FUNCTION ---
   * Handles the bonus modal confirmation
   */
  const handleConfirmBonus = async () => {
    const { teamName, points } = bonusModal;
    const pointsNum = parseInt(points, 10);

    if (isNaN(pointsNum) || pointsNum === 0) {
      closeBonusModal();
      setModal({ isOpen: true, message: 'Invalid points. Please enter a non-zero number.', onConfirm: null });
      return;
    }

    console.log(`Adding bonus of ${pointsNum} for ${teamName}`);
    try {
      const response = await fetch('/api/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: teamName,
          points: pointsNum,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add bonus');
      }
      
      closeBonusModal();
      setModal({ isOpen: true, message: `Bonus of ${pointsNum} added for ${teamName}!`, onConfirm: null });
      
    } catch (error) {
      closeBonusModal();
      console.error('Failed to add bonus:', error);
      setModal({ isOpen: true, message: `Failed to add bonus. ${(error as Error).message}`, onConfirm: null });
    }
  };


  /**
   * --- (Existing function) ---
   * Handles banning a team
   */
  const handleBan = (teamName: string) => { 
    setModal({
      isOpen: true,
      message: `Are you sure you want to ban ${teamName}?`,
      onConfirm: async () => {
        console.log(`Banning team ${teamName}`);
        try {
          const response = await fetch('/api/banlist', { // Corrected path
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName: teamName }),
          });
          
          const data = await response.json();
          if (!response.ok || !data.success) {
             throw new Error(data.error || 'Failed to ban team');
          }
          setModal({ isOpen: true, message: `${teamName} has been banned.`, onConfirm: null });
        } catch (error) {
          console.error('Failed to ban user:', error);
          setModal({ isOpen: true, message: `Failed to ban ${teamName}. ${(error as Error).message}`, onConfirm: null });
        }
      }
    });
  };

  /**
   * --- (Existing function) ---
   * Handles unbanning a team
   */
  const handleUnban = (teamName: string) => { 
    setModal({
      isOpen: true,
      message: `Are you sure you want to unban ${teamName}?`,
      onConfirm: async () => {
        console.log(`Unbanning team ${teamName}`);
        try {
          const response = await fetch('/api/banlist', { // Corrected path
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName: teamName }),
          });
          
          const data = await response.json();
          if (!response.ok || !data.success) {
             throw new Error(data.error || 'Failed to unban team');
          }
          setModal({ isOpen: true, message: `${teamName} has been unbanned.`, onConfirm: null });
        } catch (error) {
          console.error('Failed to unban user:', error);
          setModal({ isOpen: true, message: `Failed to unban ${teamName}. ${(error as Error).message}`, onConfirm: null });
        }
      }
    });
  };

  // Helper to close the main modal
  const closeModal = () => {
    setModal({ isOpen: false, message: '', onConfirm: null });
  };
  
  // Helper to confirm action in main modal
  const confirmModal = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  // --- NEW FUNCTION ---
  // Helper to close the bonus modal
  const closeBonusModal = () => {
    setBonusModal({ isOpen: false, teamName: '', points: '' });
  };

  return (
    <div className="font-sans max-w-5xl mx-auto my-5 p-5 bg-white rounded-md shadow">
      
      {/* --- (Unchanged) Input Section --- */}
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contest ID */}
          <div>
            <label htmlFor="contestId" className="block text-sm font-medium text-gray-700 mb-1">
              Contest ID
            </label>
            <input
              type="text"
              id="contestId"
              value={contestId}
              onChange={(e) => setContestId(e.target.value)}
              placeholder="e.g., 123456"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          
          {/* Contest Name */}
          <div>
            <label htmlFor="contestName" className="block text-sm font-medium text-gray-700 mb-1">
              Contest Name
            </label>
            <input
              type="text"
              id="contestName"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              placeholder="e.g., My Awesome Contest"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          
          {/* Contest Link */}
          <div className="md:col-span-2">
            <label htmlFor="contestLink" className="block text-sm font-medium text-gray-700 mb-1">
              Contest Link
            </label>
            <input
              type="text"
              id="contestLink"
              value={contestLink}
              onChange={(e) => setContestLink(e.target.value)}
              placeholder="e.g., https://my-contest.com/join"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={handleStartContest}
            className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Contest
          </button>
          
          <button
            onClick={handleDownloadCsv}
            className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-green-600 hover:bg-green-700"
          >
            Download List
          </button>
        </div>
      </div>
      {/* --- END OF INPUT SECTION --- */}


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
              
              const teamDisplayName = team.teamName || handle; 

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
                        // --- MODIFIED OnClick ---
                        onClick={() => handleAddBonus(teamDisplayName)}
                      >
                        Add Bonus
                      </button>
                      <button
                        className="py-1 px-3 text-sm font-medium border border-gray-300 rounded cursor-pointer transition-colors text-white bg-red-600 hover:bg-red-700"
                        onClick={() => handleBan(teamDisplayName)} 
                      >
                        Ban
                      </button>
                      <button
                        className="py-1 px-3 text-sm font-medium border border-gray-300 rounded cursor-pointer transition-colors text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleUnban(teamDisplayName)} 
                      >
                        Unban
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- (Unchanged) Custom Modal --- */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <p className="text-gray-800 mb-4 text-base">{modal.message}</p>
            <div className="flex justify-end gap-3">
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
                {modal.onConfirm ? 'Cancel' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END OF CUSTOM MODAL --- */}

      {/* --- NEW BONUS MODAL --- */}
      {bonusModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Add Bonus for {bonusModal.teamName}</h3>
            <div className="mb-4">
              <label htmlFor="bonusPoints" className="block text-sm font-medium text-gray-700 mb-1">
                Bonus Points (can be negative)
              </label>
              <input
                type="number"
                id="bonusPoints"
                value={bonusModal.points}
                onChange={(e) => setBonusModal({ ...bonusModal, points: e.target.value })}
                placeholder="e.g., 5 or -5"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleConfirmBonus}
                className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={closeBonusModal}
                className="py-2 px-4 text-sm font-medium rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END OF BONUS MODAL --- */}

    </div>
  );
}