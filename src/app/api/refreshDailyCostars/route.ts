import { NextResponse } from 'next/server';
import { fetchDailyCostars, getDaily } from '@/services/scheduler.service';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET() {
  console.log("Revalidating")

  await fetchDailyCostars();

  revalidateTag('daily_costars');
  revalidatePath('/(home)', 'page');
  revalidatePath('/(app)/daily', 'page');

  const {target, starter} = await getDaily();

  return NextResponse.json({ ok: true, starter: starter.label, target: target.label });
}
