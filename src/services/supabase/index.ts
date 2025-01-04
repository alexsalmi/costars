'use server';
import {
  sbGetDailyCostars,
  sbPostDailyCostars,
  sbUpdateDailyCostars,
} from './dailyCostars.supabase';

import {
  sbGetDailyStats,
  sbPostDailyStats,
  sbUpdateDailyStats,
} from './dailyStats.supabase';

import {
  sbGetUnlimitedStats,
  sbPostUnlimitedStats,
  sbUpdateUnlimitedStats,
} from './unlimitedStats.supabase';

import {
  sbGetSolutions,
  sbPostSolutions,
  sbDeleteSolutions,
} from './solutions.supabase';

export const sb_GetDailyCostars = sbGetDailyCostars;
export const sb_PostDailyCostars = sbPostDailyCostars;
export const sb_UpdateDailyCostars = sbUpdateDailyCostars;

export const sb_GetDailyStats = sbGetDailyStats;
export const sb_PostDailyStats = sbPostDailyStats;
export const sb_UpdateDailyStats = sbUpdateDailyStats;

export const sb_GetUnlimitedStats = sbGetUnlimitedStats;
export const sb_PostUnlimitedStats = sbPostUnlimitedStats;
export const sb_UpdateUnlimitedStats = sbUpdateUnlimitedStats;

export const sb_GetSolutions = sbGetSolutions;
export const sb_PostSolutions = sbPostSolutions;
export const sb_DeleteSolutions = sbDeleteSolutions;
