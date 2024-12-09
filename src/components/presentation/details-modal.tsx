'use client'
import Image from 'next/image';
import CSModal from '../presentation/modal';
import '@/styles/components/details-modal.scss'
import { useEffect, useState } from 'react';
import { getCredits, getDetails } from '@/services/tmdb.service';
import CSButton from '../inputs/button';
import useGameState from '@/store/game.state';

interface ICSDetailsModalProps {
	entity: GameEntity
	isOpen: boolean,
	close: () => void
}

export default function CSDetailsModal({ isOpen, close, entity }: ICSDetailsModalProps) {
	const [details, setDetails] = useState({} as PersonDetails | MovieDetails);
	const [credits, setCredits] = useState([] as Array<GameEntity>);
	const [hintState, setHintState] = useState('hidden' as 'hidden' | 'pending' | 'revealed');
	const { history, addEntity } = useGameState();

	useEffect(() => {
		console.log(JSON.stringify(entity))

		getDetails(entity.id, entity.type)
		.then(res => {
			setDetails(res)
		});
	}, []);

	const formatDate = (date: string) => {
		return new Date(date).toUTCString().split(' ').splice(1,3).join(' ');
	}

	const viewCredits = async () => {
		setCredits(
			(await getCredits(entity.id, entity.type))
				.sort((a, b) => b.popularity - a.popularity)
				.map(credit => ({
					type: entity.type === 'person' ? 'movie': 'person' as TmdbType,
					id: credit.id,
					label: (credit as MovieCredit).title || (credit as PersonCredit).name,
					image: (credit as MovieCredit).poster_path || (credit as PersonCredit).profile_path,
				}))
			);
		
		setHintState('revealed');
	}

	const selectCredit = (credit: GameEntity) => {
		const isMostRecentInHistory = entity.id === history[0].id && entity.type === history[0].type;
		const isAlreadyInHistory = history.some(entity => entity.id === credit.id && entity.type === credit.type);
		if(!isMostRecentInHistory || isAlreadyInHistory)
			return;

		addEntity(credit);
		close();
	}

  return (
		<CSModal isOpen={isOpen} close={close} className='details-modal-container'>
			<div className='details-modal-hero'>
				<Image className='card-image' 
					src={`https://image.tmdb.org/t/p/w185${entity.image}`} alt={`Picture of ${entity.label}`} 
					width={120} height={180}
					placeholder='blur'
					blurDataURL='/placeholder.webp'
				/>
				<div className='details-modal-hero-text'>
					<h2>{entity.label}</h2>
					{entity.type === 'person' ?
						<>
							<span>{formatDate((details as PersonDetails).birthday)}</span>
							<span>{(details as PersonDetails).place_of_birth}</span>
						</>
						:
						<>
							<span>{formatDate((details as MovieDetails).release_date)}・{(details as MovieDetails).runtime} minutes</span>
							<span>{(details as MovieDetails).genres?.map(g => g.name).join("・")}</span>
						</>
					}
				</div>
			</div>
			<p className="details-modal-description">
				{entity.type === 'person' ?
					(details as PersonDetails).biography?.split(".").slice(0,2).join(".") + "."
					:
					(details as MovieDetails).overview
				}
			</p>
			<div className={
					`details-modal-credits 
					${hintState === 'revealed' ? 'revealed' : ''}
				`}
			>
				{ hintState === 'hidden' ?
						<CSButton onClick={() => setHintState('pending')}>
							View credits
						</CSButton>
					: hintState === 'pending' ?
					<>
						<div>Are you sure? Revealing {entity.label + "'s"} credits will use a hint.</div>
						<CSButton onClick={() => viewCredits()}>
							Yes, {"I'll"} use a hint
						</CSButton>
					</>
					: credits.map(credit => {
						return(
							<span className='details-modal-credit-display' key={credit.id}
								onClick={() => selectCredit(credit)}
							>
								<Image className='card-image' 
									src={`https://image.tmdb.org/t/p/w185${credit.image}`} alt={`Picture of ${credit.label}`} 
									width={100} height={150}
									placeholder='blur'
									blurDataURL='/placeholder.webp'
								/>
								<span>{credit.label}</span>
							</span>
						)
					})
				}
			</div>
		</CSModal>
  );
}
