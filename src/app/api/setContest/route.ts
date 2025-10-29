import redis from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function POST(request: Request){
    const body = await request.json();
    const {contestId, contestName} = body;

    if (!contestId || !contestName) {
        return NextResponse.json(
        { success: false, error: 'Missing contestId or contestName' },
        { status: 400 }
        );
    }

    await redis.set('test:currentContest', JSON.stringify({contestId, contestName}));

    return NextResponse.json({success:true});
}