import { NextResponse } from "next/server";
import redis from "@/lib/redis";

let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30_000; // 10 seconds

export async function GET() {
  const now = Date.now();

  // ✅ Serve from in-memory cache if recent
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      ...cache.data,
      cached: true,
      source: "memory",
    });
  }

  // Otherwise fetch from Redis
  const currentStandings = await redis.get("test:currentStandings");
  console.log("Redis hit for getting fresh data");
  if (!currentStandings) {
    return NextResponse.json(
      { success: false, error: "No current standings available" },
      { status: 404 }
    );
  }

  const result = JSON.parse(currentStandings);

  // Cache locally for 10s
  cache = {
    data: result,
    timestamp: now,
  };

  return NextResponse.json({
    ...result,
    cached: false,
    source: "redis",
  });
}
