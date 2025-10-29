import { NextResponse } from 'next/server';
import { json2csv } from 'json-2-csv';
import { fetchStandings } from '../setStandings/route';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const contestId = url.searchParams.get('contestId');

    if (!contestId) {
      return NextResponse.json(
        { success: false, error: 'Missing contestId in query string' },
        { status: 400 }
      );
    }

    const result = await fetchStandings(Number(contestId));
    if (!result || !result.rows) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch standings or no rows found' },
        { status: 500 }
      );
    }

    const maxProblems = Math.max(
      ...result.rows.map((r: any) => r.problemResults.length)
    );

    const flattened = result.rows.map((row: any) => {
      const base: Record<string, any> = {
        teamName: row.party.teamName,
        handle: row.party.members.map((m: any) => m.handle).join(', '),
        rank: row.rank,
        totalPoints: row.points,
        penalty: row.penalty,
      };

      row.problemResults.forEach((p: any, i: number) => {
        base[`P${i + 1}_points`] = p.points;
        base[`P${i + 1}_attempts`] = p.rejectedAttemptCount;
      });

      for (let i = row.problemResults.length; i < maxProblems; i++) {
        base[`P${i + 1}_points`] = 0;
        base[`P${i + 1}_attempts`] = 0;
      }

      return base;
    });

    const csvData = json2csv(flattened);

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="standings_${contestId}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating standings CSV:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
