import { NextResponse } from 'next/server';
import { fetchDailyCostars } from '@/services/scheduler.service';
import { revalidatePath } from 'next/cache';

export async function GET() {
  console.log("Revalidating")

  await fetchDailyCostars();

  revalidatePath('/(home)/page', 'page');
  revalidatePath('/(app)/daily/page', 'page');

  return NextResponse.json({ ok: true });
}