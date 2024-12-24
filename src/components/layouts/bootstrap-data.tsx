"use client";

import useGameState from "@/store/game.state";
import { useEffect } from "react";

export default function BootstrapData({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const { bootstrapState } = useGameState();

  useEffect(() => {
    bootstrapState();
  }, []);

  return (
    <>
      { children }
    </>
  );
}