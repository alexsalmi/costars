import { atom } from "jotai";

export const gameTypeAtom = atom('unlimited');

export const historyAtom = atom([] as Array<GameEntity>);

export const scoreAtom = atom((get) => get(historyAtom).length);

export const highScoreAtom = atom(() => parseInt(window?.localStorage.getItem('costars-highscore') || '0'));