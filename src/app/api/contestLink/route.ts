import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  const data = await redis.get("test:currentContest");
  if (!data){
    return NextResponse.json(
        {success: false, error: "No contest active"},
        {status: 404}
    )
  }
  const {contestLink} = JSON.parse(data);

  if (contestLink==""){
    return NextResponse.json(
    {success: false, error: "No link exists. Please contact OC."},
    {status: 404}
    )
  }
  

  return NextResponse.json({
    success: true,
    contestLink: contestLink,
  });
}
