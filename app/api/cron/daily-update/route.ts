import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// This endpoint can be called by external cron services (Vercel Cron, etc.)
export async function GET(request: Request) {
  // Optional: Add authentication
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting daily update via API...');
    
    // Update matches
    console.log('Updating matches...');
    const { stdout: matchOutput } = await execPromise('npm run update-matches');
    
    // Generate predictions
    console.log('Generating predictions...');
    const { stdout: predOutput } = await execPromise('npm run generate-predictions');
    
    return NextResponse.json({
      success: true,
      message: 'Daily update completed',
      timestamp: new Date().toISOString(),
      matchUpdate: matchOutput.substring(0, 200),
      predictionUpdate: predOutput.substring(0, 200),
    });
  } catch (error: any) {
    console.error('Error in daily update:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
