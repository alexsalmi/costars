'use client'
import Image from 'next/image';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/components/daily-costars.scss'
import { getScoreString, isToday } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { getDailyStats, getUserDailySolutions } from '@/services/userdata.service';

interface IDailyCostarsProps {
	starter: GameEntity,
	target: GameEntity
}

export default function CSDailyCostars({starter, target}: IDailyCostarsProps) {
	const [lastSolve, setLastSolve] = useState<Solution | null>(null);
	const [completed, setCompleted] = useState(false);
	
	useEffect(() => {
		getDailyStats().then(async dailyStats => {
			const solutions = await getUserDailySolutions();
			console.log("Last: " + solutions)
			setLastSolve(solutions.find(sol => sol.daily_id === dailyStats.last_played_id) || null);
			setCompleted((dailyStats.last_played && isToday(new Date(dailyStats.last_played))) || false);
		})
	}, []);

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
					{completed && lastSolve ? getScoreString(lastSolve.solution, lastSolve.hints!) : 'Play!'}
				</CSButton>
			</Link>
		</div>
  );
}
