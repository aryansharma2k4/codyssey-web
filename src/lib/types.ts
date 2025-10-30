export interface Problem {
  index: string; // "A", "B", "C" etc.
  name: string;
  points?: number;
}

export interface ProblemResult {
  points: number;
  rejectedAttemptCount: number;
  bestSubmissionTimeSeconds?: number;
}

export interface Party {
  members: Array<{ handle: string }>;
  teamName: string;
}

export interface Row {
  party: Party;
  rank: number;
  points: number;   // Total score
  penalty: number;  // Penalty time (we'll display this)
  problemResults: ProblemResult[];
}

export interface Contest {
  name: string;
}

// This is the main data structure for the standings
export interface StandingsData {
  contest: Contest;
  problems: Problem[];
  rows: Row[];
}

// This is the shape of the full API response
export interface ApiResponse {
  standings: StandingsData;
  cached?: boolean;
  source?: string;
}