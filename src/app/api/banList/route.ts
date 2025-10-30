import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const BANLIST_KEY = "banlist:teams";

// 🟢 Add a team to the banlist
export async function POST(request: Request) {
  try {
    const { teamName } = await request.json();

    if (!teamName)
      return NextResponse.json(
        { success: false, error: "Missing teamName" },
        { status: 400 }
      );

    await redis.SADD(BANLIST_KEY, teamName);

    return NextResponse.json({ success: true, message: `Banned ${teamName}` });
  } catch (error) {
    console.error("Error adding to banlist:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

// 🔴 Remove a team from the banlist
export async function DELETE(request: Request) {
  try {
    const { teamName } = await request.json();

    if (!teamName)
      return NextResponse.json(
        { success: false, error: "Missing teamName" },
        { status: 400 }
      );

    const removed = await redis.SREM(BANLIST_KEY, teamName);

    if (removed === 0)
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: `Unbanned ${teamName}` });
  } catch (error) {
    console.error("Error removing from banlist:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

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