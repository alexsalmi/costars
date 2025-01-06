import {
  lsHasDailyStats,
  lsGetDailyStats,
  lsPostDailyStats,
  lsDeleteDailyStats,
} from './dailyStats.localstorage';

import {
  lsHasUnlimitedStats,
  lsGetUnlimitedStats,
  lsPostUnlimitedStats,
  lsDeleteUnlimitedStats,
} from './unlimitedStats.localstorage';

import {
  lsHasSolutions,
  lsGetSolutions,
  lsPostSolutions,
  lsDeleteSolutions,
} from './solutions.localstorage';

import {
  lsGetFreshStatus,
  lsPostFreshStatus,
  lsDeleteFreshStatus,
} from './freshStatus.localstorage';

import {
  lsHasDailySave,
  lsGetDailySave,
  lsPostDailySave,
  lsDeleteDailySave,
} from './dailySave.localstorage';

import { lsGetAuthStatus, lsPostAuthStatus } from './authStatus.localstorage';

export const ls_HasDailyStats = lsHasDailyStats;
export const ls_GetDailyStats = lsGetDailyStats;
export const ls_PostDailyStats = lsPostDailyStats;
export const ls_DeleteDailyStats = lsDeleteDailyStats;

export const ls_HasUnlimitedStats = lsHasUnlimitedStats;
export const ls_GetUnlimitedStats = lsGetUnlimitedStats;
export const ls_PostUnlimitedStats = lsPostUnlimitedStats;
export const ls_DeleteUnlimitedStats = lsDeleteUnlimitedStats;

export const ls_HasSolutions = lsHasSolutions;
export const ls_GetSolutions = lsGetSolutions;
export const ls_PostSolutions = lsPostSolutions;
export const ls_DeleteSolutions = lsDeleteSolutions;

export const ls_GetFreshStatus = lsGetFreshStatus;
export const ls_PostFreshStatus = lsPostFreshStatus;
export const ls_DeleteFreshStatus = lsDeleteFreshStatus;

export const ls_GetAuthStatus = lsGetAuthStatus;
export const ls_PostAuthStatus = lsPostAuthStatus;

export const ls_HasDailySave = lsHasDailySave;
export const ls_GetDailySave = lsGetDailySave;
export const ls_PostDailySave = lsPostDailySave;
export const ls_DeleteDailySave = lsDeleteDailySave;
