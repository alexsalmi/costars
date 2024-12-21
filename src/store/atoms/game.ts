import { atom } from "jotai";
import { getDailyStats, getHighscore } from "@/services/storage.service";
import { getUserFromClient } from "@/utils/utils";

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

export const highScoreAtom = atom(getHighscore());
export const dailyStatsAtom = atom(getDailyStats());

export const userAtom = atom(async () => await getUserFromClient());