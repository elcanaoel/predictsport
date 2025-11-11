import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { footballApiService } from '@/lib/football-api';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id);

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        predictions: true,
      },
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      );
    }

    // If match is live, fetch latest data
    if (['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(match.status)) {
      try {
        const fixtures = await footballApiService.getFixturesByDate(
          match.matchDate.toISOString().split('T')[0]
        );
        
        const liveData = fixtures.find(f => f.fixture.id === match.fixtureId);
        
        if (liveData) {
          // Update match
          const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: {
              status: liveData.fixture.status.short,
              homeScore: liveData.goals.home,
              awayScore: liveData.goals.away,
            },
            include: {
              homeTeam: true,
              awayTeam: true,
              league: true,
              predictions: true,
            },
          });

          return NextResponse.json({
            success: true,
            match: updatedMatch,
            live: true,
          });
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    }

    return NextResponse.json({
      success: true,
      match,
      live: false,
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}
