import redis from "@/lib/redis";
import { NextResponse } from "next/server";

const BONUSES_KEY = "bonuses";

// ✅ Add or update bonus
export async function POST(req: Request) {
  try {
    const { teamName, points } = await req.json();

    if (!teamName || typeof points !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid teamName/points" },
        { status: 400 }
      );
    }

    await redis.hIncrBy(BONUSES_KEY, teamName, points);

    return NextResponse.json({
      success: true,
      message: `${points >= 0 ? "Added" : "Deducted"} ${points} points for ${teamName}`,
    });
  } catch (error) {
    console.error("Error adding bonus:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Delete a team’s bonus
export async function DELETE(req: Request) {
  try {
    const { teamName } = await req.json();

    if (!teamName) {
      return NextResponse.json(
        { success: false, error: "Missing teamName" },
        { status: 400 }
      );
    }

    await redis.hDel(BONUSES_KEY, teamName);

    return NextResponse.json({ success: true, message: `Removed bonus for ${teamName}` });
  } catch (error) {
    console.error("Error removing bonus:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
