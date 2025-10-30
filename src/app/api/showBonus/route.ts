import { NextResponse } from "next/server";
import redis from '@/lib/redis';


const BONUSES_KEY = "bonuses"
// ✅ Get all bonuses
export async function GET() {
  try {
    const bonuses = await redis.hGetAll(BONUSES_KEY);
    return NextResponse.json({ success: true, bonuses });
  } catch (error) {
    console.error("Error fetching bonuses:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}