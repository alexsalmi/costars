import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(req: NextRequest) {
  if (
    process.env.IS_PRODUCTION === 'true' &&
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );
  }

  console.log(`----- REFRESHING DAILY COSTARS -----`);

  revalidateTag('daily_costars');
  revalidatePath('/');
  revalidatePath('/daily');
  revalidatePath('/daily/archive');
  revalidatePath('/admin');

  for (let num = 1; num < 24; num++) revalidatePath(`/daily/${num}`);

  console.log('----- FINISHED REFRESHING COSTARS -----');

  return NextResponse.json({ ok: true });
}
