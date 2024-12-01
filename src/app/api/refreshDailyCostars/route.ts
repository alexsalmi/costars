import { NextResponse } from 'next/server';
import { fetchDailyCostars } from '@/services/scheduler.service';
import { revalidatePath } from 'next/cache';

export async function GET() {
  console.log("Revalidating")

  await fetchDailyCostars();

  revalidatePath('/');
  revalidatePath('/daily');

  return NextResponse.json({ ok: true });
}