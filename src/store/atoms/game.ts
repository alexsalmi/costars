import { atom } from "jotai";

export const gameTypeAtom = atom('unlimited');
export const historyAtom = atom([] as Array<GameEntity>);

export const currentAtom = atom((get) => get(historyAtom)[0] || null);
export const scoreAtom = atom((get) => get(historyAtom).length);

export const highScoreAtom = atom(() => parseInt(
  typeof window !== 'undefined' ?
    window.localStorage.getItem('costars-highscore') || '0'
    : '0'
));