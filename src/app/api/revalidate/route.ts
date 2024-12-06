import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production' && 
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({}, {status: 401, statusText: "Unauthorized"});
  }

  console.log("----- REVALIDATING -----");

  revalidateTag('random_pool');
  revalidateTag('daily_costars');

  return NextResponse.json({ok: true});
}
