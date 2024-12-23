'use client'
import Image from 'next/image';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/components/daily-costars.scss'
import { getScoreString } from '@/utils/utils';
import useGameState from '@/store/game.state';

interface IDailyCostarsProps {
	starter: GameEntity,
	target: GameEntity
}

export default function CSDailyCostars({ starter, target }: IDailyCostarsProps) {
	const { lastSolve, dailyCompleted } = useGameState();

  return (
		<div className='daily-costars-container'>
			<h3 className='daily-costars-header'>Daily Costars</h3>
			<div className='daily-costars-previews'>
				<Image 
					src={starter.image ? `https://image.tmdb.org/t/p/w185${starter.image}` : '/placeholder.webp'}
					width={80} height={120} alt={`Image of ${starter.label}`}
				/>
				<div className='daily-costars-names'>
					<span>{starter.label}</span>
					<span>and</span>
					<span>{target.label}</span>
				</div>
				<Image
					src={starter.image ? `https://image.tmdb.org/t/p/w185${target.image}` : '/placeholder.webp'}
					width={80} height={120} alt={`Image of ${target.label}`}
				/>
			</div>
			<Link href="/daily">
				<CSButton>
					{dailyCompleted && lastSolve ? getScoreString(lastSolve.solution, lastSolve.hints!) : 'Play!'}
				</CSButton>
			</Link>
		</div>
  );
}
