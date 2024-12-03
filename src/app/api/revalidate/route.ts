import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET() {
  console.log("----- REVALIDATING -----");

  revalidateTag('daily_costars');

  return NextResponse.json({ok: true});
}
