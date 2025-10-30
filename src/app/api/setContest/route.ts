import redis from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function POST(request: Request){
    const body = await request.json();
    const {contestId, contestName, contestLink} = body;

    if (!contestId || !contestName || !contestLink) {
        return NextResponse.json(
        { success: false, error: 'Missing contestId, contestName or contestLink' },
        { status: 400 }
        );
    }

    await redis.set('test:currentContest', JSON.stringify({contestId, contestName, contestLink}));

    return NextResponse.json({success:true});
}