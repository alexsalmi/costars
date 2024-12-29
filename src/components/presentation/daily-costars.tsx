'use client'
import Image from 'next/image';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/components/daily-costars.scss'
import { getScoreString } from '@/utils/utils';
import useGameState from '@/store/game.state';

interface IDailyCostarsProps {
	daily?: DailyCostars
}

export default function CSDailyCostars({ daily }: IDailyCostarsProps) {
	const { lastSolve } = useGameState();

  return (
		<div className='daily-costars-container'>
			<h3 className='daily-costars-header'>Daily Costars</h3>
			<div className='daily-costars-previews'>
				<Image
					priority
					src={daily?.starter.image ? `https://image.tmdb.org/t/p/w185${daily?.starter.image}` : '/placeholder.webp'}
					width={80} height={120} alt={`Image of ${daily?.starter.label}`}
				/>
				<div className='daily-costars-names'>
					<span>{daily?.starter.label}</span>
					<span>and</span>
					<span>{daily?.target.label}</span>
				</div>
				<Image
					priority
					src={daily?.starter.image ? `https://image.tmdb.org/t/p/w185${daily?.target.image}` : '/placeholder.webp'}
					width={80} height={120} alt={`Image of ${daily?.target.label}`}
				/>
			</div>
			<Link href="/daily">
				<CSButton>
					{lastSolve && daily?.id === lastSolve.daily_id ? getScoreString(lastSolve.solution, lastSolve.hints!) : 'Play!'}
				</CSButton>
			</Link>
		</div>
  );
}
