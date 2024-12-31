import supabaseService from '@/services/supabase';
import { NextRequest, NextResponse } from 'next/server';

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

  console.log(`----- CLEANING OUT OLD SOLUTIONS -----`);

  const date = new Date();
  date.setDate(date.getDate() - 7);

  await supabaseService.solutions.delete({
    is_temporary: true,
    after_date: date.toUTCString(),
  });

  console.log('----- FINISHED CLEANING OUT OLD SOLUTIONS -----');

  return NextResponse.json({ ok: true });
}
