'use client'
import CSCustomGameModal from "@/components/game/custom-game-modal";
import GameContainer from "@/components/game/game-container";
import useGameState from "@/store/game.state";
import { useEffect } from "react";

export default function NewCustomGame() {
  const { initCustomGame } = useGameState();

  useEffect(() => {
    initCustomGame();
  }, []);

  return (
    <>
      <CSCustomGameModal />
      <GameContainer />
    </>
  );
}
