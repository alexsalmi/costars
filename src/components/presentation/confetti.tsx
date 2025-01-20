'use client';
import { useEffect } from 'react';
import '@/styles/presentation/confetti.scss';
import { Star } from '@mui/icons-material';

interface ICSConfettiProps {
  stars?: boolean;
}

export default function CSConfetti({ stars }: ICSConfettiProps) {
  useEffect(() => {
    const confettiWrapper =
      document.querySelectorAll<HTMLDivElement>('.confetti-piece');

    // Generate confetti
    for (const confetti of confettiWrapper) {
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.setProperty(
        '--fall-duration',
        `${Math.random() * 3 + 3}s`,
      );
      confetti.style.setProperty('--confetti-color', getRandomColor());
    }
  }, []);

  const width = typeof window === 'undefined' ? 100 : window.innerWidth;
  const arr = Array(Math.floor(width / 10)).fill(0);

  return (
    <div className='confetti-container'>
      {arr.map((_, ind) =>
        stars ? (
          <Star
            key={ind}
            className={`confetti-piece star ${ind % 2 ? 'left' : 'right'}`}
          />
        ) : (
          <div
            key={ind}
            className={`confetti-piece ${ind % 2 ? 'left' : 'right'}`}
          ></div>
        ),
      )}
    </div>
  );
}

function getRandomColor() {
  const colors = ['#e39e27', '#7a2010', '#fabb07', '#f0b105', '#fdf6ed'];
  return colors[Math.floor(Math.random() * colors.length)];
}
