import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );
  }

  console.log(`----- REFRESHING RANDOM POOL -----`);

  revalidateTag('random_pool');
  revalidateTag('trending_people');


  console.log('----- FINISHED REFRESHING RANDOM POOL -----');

  return NextResponse.json({ ok: true });
}
