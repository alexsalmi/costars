import { atom } from "jotai";

export const gameTypeAtom = atom('custom');
export const targetAtom = atom({} as GameEntity);
export const historyAtom = atom([] as Array<GameEntity>);
export const hintsAtom = atom([] as Array<Hint>);
export const undoCacheAtom = atom([] as Array<GameEntity>);
export const condensedAtom = atom(false);

export const currentAtom = atom((get) => get(historyAtom)[0] || null);
export const scoreAtom = atom((get) => get(historyAtom).length);
export const completedAtom = atom(false);
export const isSolutionAtom = atom(() => 
	typeof window !== 'undefined' ? 
	window.location.pathname.includes('/solution')
	: false
)

export const highScoreAtom = atom(0);

export const dailyStatsAtom = atom<DailyStats | null>(null);
export const unlimitedStatsAtom = atom<UnlimitedStats | null>(null);
export const lastSolveAtom = atom<Solution | null>(null);
export const userDailySolutionsAtom = atom<Array<Solution> | null>(null);
export const todaysCostarsAtom = atom<DailyCostars | null>(null);
export const todaysSolutionsAtom = atom<Array<Solution> | null>(null);
export const userAtom = atom<UserInfo | null>(null);