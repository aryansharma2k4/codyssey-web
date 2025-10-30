import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

const BANLIST_KEY = "banlist:teams"

// 🟡 Get all banned teams
export async function GET() {
  try {
    const bannedTeams = await redis.SMEMBERS(BANLIST_KEY);
    return NextResponse.json({ success: true, bannedTeams });
  } catch (error) {
    console.error("Error fetching banlist:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}