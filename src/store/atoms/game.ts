import { atom } from "jotai";
import { getHighscore } from "@/services/storage.service";

export const gameTypeAtom = atom('unlimited');
export const historyAtom = atom([] as Array<GameEntity>);
export const undoCacheAtom = atom([] as Array<GameEntity>);
export const condensedAtom = atom(false);

export const currentAtom = atom((get) => get(historyAtom)[0] || null);
export const scoreAtom = atom((get) => get(historyAtom).length);

export const highScoreAtom = atom(getHighscore());