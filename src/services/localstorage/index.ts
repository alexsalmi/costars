import {
  lsHasDailyStats,
  lsGetDailyStats,
  lsPostDailyStats,
} from './dailyStats.localstorage';

import {
  lsHasUnlimitedStats,
  lsGetUnlimitedStats,
  lsPostUnlimitedStats,
} from './unlimitedStats.localstorage';

import {
  lsHasSolutions,
  lsGetSolutions,
  lsPostSolutions,
} from './solutions.localstorage';

import {
  lsGetFreshStatus,
  lsPostFreshStatus,
  lsDeleteFreshStatus,
} from './freshStatus.localstorage';

import { lsGetAuthStatus, lsPostAuthStatus } from './authStatus.localstorage';

export const ls_HasDailyStats = lsHasDailyStats;
export const ls_GetDailyStats = lsGetDailyStats;
export const ls_PostDailyStats = lsPostDailyStats;

export const ls_HasUnlimitedStats = lsHasUnlimitedStats;
export const ls_GetUnlimitedStats = lsGetUnlimitedStats;
export const ls_PostUnlimitedStats = lsPostUnlimitedStats;

export const ls_HasSolutions = lsHasSolutions;
export const ls_GetSolutions = lsGetSolutions;
export const ls_PostSolutions = lsPostSolutions;

export const ls_GetFreshStatus = lsGetFreshStatus;
export const ls_PostFreshStatus = lsPostFreshStatus;
export const ls_DeleteFreshStatus = lsDeleteFreshStatus;

export const ls_GetAuthStatus = lsGetAuthStatus;
export const ls_PostAuthStatus = lsPostAuthStatus;
