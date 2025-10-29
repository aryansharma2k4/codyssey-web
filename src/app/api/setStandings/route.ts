import redis from "@/lib/redis";
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

const CODEFORCES_API_KEY = process.env.CODEFORCES_API_KEY!;
const CODEFORCES_API_SECRET = process.env.CODEFORCES_API_SECRET!;

export async function POST() {
  const currentContest = await redis.get("test:currentContest");
  if (!currentContest) {
    return NextResponse.json(
      { success: false, error: "No current contest set." },
      { status: 404 }
    );
  }

  const { contestId } = JSON.parse(currentContest);
  if (!contestId) {
    return NextResponse.json(
      { success: false, error: "Missing contestId" },
      { status: 400 }
    );
  }

  const standings = await fetchStandings(contestId);
  if (!standings) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch standings" },
      { status: 500 }
    );
  }

  const payload = {
    standings,
    lastUpdatedAt: new Date().toISOString(),
  };

  await redis.set("test:currentStandings", JSON.stringify(payload));
  console.log("Redis hit for standings update")
  return NextResponse.json({ success: true, updatedAt: payload.lastUpdatedAt });
}

// --- Helper: sign Codeforces API requests ---
function signCodeforcesRequest(
  method: string,
  params: Record<string, string | number>
): { apiSig: string; time: number } {
  const rand = Math.random().toString(36).substring(2, 8); // 6 random chars
  const time = Math.floor(Date.now() / 1000);

  params.apiKey = CODEFORCES_API_KEY;
  params.time = time;

  const sortedParams = Object.entries(params)
    .sort(([k1, v1], [k2, v2]) => {
      if (k1 === k2) return String(v1).localeCompare(String(v2));
      return k1.localeCompare(k2);
    })
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const baseString = `${rand}/${method}?${sortedParams}#${CODEFORCES_API_SECRET}`;
  const hash = crypto.createHash("sha512").update(baseString).digest("hex");
  const apiSig = `${rand}${hash}`;

  return { apiSig, time };
}

// --- Helper: fetch standings from Codeforces ---
async function fetchStandings(contestId: number) {
  try {
    const method = "contest.standings";
    const params = {
      contestId,
      from: 1,
      count: 1000,
    };

    const { apiSig, time } = signCodeforcesRequest(method, params);

    const response = await axios.get(`https://codeforces.com/api/${method}`, {
      params: {
        ...params,
        apiKey: CODEFORCES_API_KEY,
        time,
        apiSig,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error(response.data.comment || "Codeforces API error");
    }

    console.log("Standings received");
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch Codeforces standings:", error);
    return null;
  }
}