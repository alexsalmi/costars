'use client';

import useGameState from '@/store/game.state';
import { useEffect } from 'react';

export default function InitStateProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { bootstrapState } = useGameState();

  useEffect(() => {
    bootstrapState();
  }, []);

  return <>{children}</>;
}
