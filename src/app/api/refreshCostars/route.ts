import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getDayNumber } from '@/utils/utils';

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

  // const day_number = getDayNumber(new Date().toISOString());
  // revalidatePath(`/daily/${day_number}`);
  // revalidatePath(`/daily/${day_number - 1}`);

  console.log('----- FINISHED REFRESHING COSTARS -----');

  return NextResponse.json({ ok: true });
}
