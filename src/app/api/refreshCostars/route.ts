import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

  console.log(`----- REFRESHING DAILY COSTARS -----`);

  revalidatePath('/');
  revalidatePath('/daily');
  revalidatePath('/admin');

  console.log('----- FINISHED REFRESHING COSTARS -----');

  return NextResponse.json({ ok: true });
}
