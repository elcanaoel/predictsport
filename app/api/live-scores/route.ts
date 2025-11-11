import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { footballApiService } from '@/lib/football-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all live and upcoming matches from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matches = await prisma.match.findMany({
      where: {
        matchDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['NS', '1H', 'HT', '2H', 'ET', 'P', 'LIVE'],
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
      },
      orderBy: {
        matchDate: 'asc',
      },
    });

    // Fetch live updates from API for in-progress matches
    const liveMatches = matches.filter(m => 
      ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(m.status)
    );

    const updates = [];
    
    for (const match of liveMatches) {
      try {
        const fixtures = await footballApiService.getFixturesByDate(
          match.matchDate.toISOString().split('T')[0]
        );
        
        const liveData = fixtures.find(f => f.fixture.id === match.fixtureId);
        
        if (liveData) {
          // Update match in database
          await prisma.match.update({
            where: { id: match.id },
            data: {
              status: liveData.fixture.status.short,
              homeScore: liveData.goals.home,
              awayScore: liveData.goals.away,
            },
          });

          updates.push({
            matchId: match.id,
            fixtureId: match.fixtureId,
            status: liveData.fixture.status.short,
            homeScore: liveData.goals.home,
            awayScore: liveData.goals.away,
            elapsed: liveData.fixture.status.elapsed || null,
          });
        }
      } catch (error) {
        console.error(`Error updating match ${match.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      matches: matches.map(m => ({
        id: m.id,
        fixtureId: m.fixtureId,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        league: m.league,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: m.status,
        matchDate: m.matchDate,
      })),
      updates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching live scores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live scores' },
      { status: 500 }
    );
  }
}
