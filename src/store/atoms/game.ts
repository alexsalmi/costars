import { atom } from "jotai";
import { getDailyStats, getHighscore } from "@/services/storage.service";

export const gameTypeAtom = atom('custom');
export const targetAtom = atom({} as GameEntity);
export const historyAtom = atom([] as Array<GameEntity>);
export const undoCacheAtom = atom([] as Array<GameEntity>);
export const condensedAtom = atom(false);

export const currentAtom = atom((get) => get(historyAtom)[0] || null);
export const scoreAtom = atom((get) => get(historyAtom).length);
export const completedAtom = atom((get) => get(historyAtom).includes(get(targetAtom)))

export const highScoreAtom = atom(getHighscore());
export const dailyStatsAtom = atom(getDailyStats());