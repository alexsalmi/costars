'use client';
import Image from 'next/image';
import CSModal from './modal';
import { useEffect, useState } from 'react';
import { getCredits, getDetails } from '@/services/tmdb.service';
import CSButton from '../inputs/buttons/button';
import useCostarsState from '@/store/costars.state';
import { CircularProgress } from '@mui/material';
import '@/styles/modals/details-modal.scss';
import CSImageModal from './image-modal';

interface ICSDetailsModalProps {
  entity: GameEntity;
  isOpen: boolean;
  close: () => void;
}

type HintState = 'hidden' | 'pending' | 'fetching' | 'revealed';

export default function CSDetailsModal({
  isOpen,
  close,
  entity,
}: ICSDetailsModalProps) {
  const { completed, history, hints, isSolution, addEntity, addHint } =
    useCostarsState();
  const [details, setDetails] = useState({} as PersonDetails | MovieDetails);
  const [credits, setCredits] = useState([] as Array<GameEntity>);
  const [loading, setLoading] = useState(false);
  const [hintState, setHintState] = useState<HintState>('hidden');
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    getDetails(entity.id, entity.type).then((res) => {
      setDetails(res);
      setLoading(false);
    });

    const hint = hints.find(
      (hint) => hint.id === entity.id && hint.type === entity.type,
    );

    if (hint) {
      viewCredits();
    }
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toUTCString().split(' ').splice(1, 3).join(' ');
  };

  const viewCredits = async () => {
    setHintState('fetching');

    const creditEntities = (await getCredits(entity.id, entity.type))
      .sort((a, b) => b.popularity - a.popularity)
      .map((credit) => ({
        type: entity.type === 'person' ? 'movie' : ('person' as TmdbType),
        id: credit.id,
        label: (credit as MovieCredit).title || (credit as PersonCredit).name,
        image:
          (credit as MovieCredit).poster_path ||
          (credit as PersonCredit).profile_path,
      })) as Array<GameEntity>;

    setCredits(creditEntities);

    if (!completed && !isSolution) addHint(entity);

    setHintState('revealed');
  };

  const selectCredit = async (credit: GameEntity) => {
    const isMostRecentInHistory =
      entity.id === history[0].id && entity.type === history[0].type;
    const isAlreadyInHistory = history.some(
      (entity) => entity.id === credit.id && entity.type === credit.type,
    );
    if (!isMostRecentInHistory || isAlreadyInHistory || completed) return;

    credit.credits = (await getCredits(credit.id, credit.type)).map(
      (credit) => credit.id,
    );

    addEntity(credit);
    close();
  };

  const censorDescription = (description: string): string => {
    if (!description) return '';
    const regex1 = /\([0-9]{4}\)/;
    const regex2 = /\([0-9]{4}–[0-9]{4}\)/;
    // return description;
    return description
      .split('.')
      .filter((str) => !regex1.test(str))
      .filter((str) => !regex2.test(str))
      .join('.');
  };

  return (
    <>
      <CSModal isOpen={isOpen} close={close}>
        <div className='details-modal-hero'>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsImageOpen(true);
            }}
          >
            <Image
              className='card-image'
              src={`https://image.tmdb.org/t/p/w185${entity.image}`}
              alt={`Picture of ${entity.label}`}
              width={120}
              height={180}
              placeholder='blur'
              blurDataURL='/placeholder.webp'
              unoptimized
            />
          </div>
          <div className='details-modal-hero-text'>
            <h3>{entity.label}</h3>
            {loading ? (
              <></>
            ) : entity.type === 'person' ? (
              <>
                <span>{formatDate((details as PersonDetails).birthday)}</span>
                <span>{(details as PersonDetails).place_of_birth}</span>
              </>
            ) : (
              <>
                <span>
                  {formatDate((details as MovieDetails).release_date)}・
                  {(details as MovieDetails).runtime} minutes
                </span>
                <span>
                  {(details as MovieDetails).genres
                    ?.map((g) => g.name)
                    .join('・')}
                </span>
              </>
            )}
          </div>
        </div>
        <p className='details-modal-description'>
          {loading ? (
            <CircularProgress className='details-modal-spinner' />
          ) : entity.type === 'person' ? (
            censorDescription((details as PersonDetails).biography)
          ) : (
            (details as MovieDetails).overview
          )}
        </p>
        <div
          className={`details-modal-credits 
					${hintState === 'revealed' ? 'revealed' : ''}
				`}
        >
          {hintState === 'hidden' ? (
            <CSButton
              onClick={() => {
                if (completed || isSolution) viewCredits();
                else setHintState('pending');
              }}
            >
              View credits
            </CSButton>
          ) : hintState === 'pending' ? (
            <>
              <div>
                Are you sure? Revealing {entity.label + "'s"} credits will use a
                hint.
              </div>
              <CSButton onClick={() => viewCredits()}>
                Yes, {"I'll"} use a hint
              </CSButton>
            </>
          ) : hintState === 'fetching' ? (
            <CircularProgress className='details-modal-spinner' />
          ) : (
            credits.map((credit) => {
              return (
                <span
                  className='details-modal-credit-display'
                  key={credit.id}
                  onClick={() => selectCredit(credit)}
                >
                  <Image
                    className='card-image'
                    src={`https://image.tmdb.org/t/p/w185${credit.image}`}
                    alt={`Picture of ${credit.label}`}
                    width={100}
                    height={150}
                    placeholder='blur'
                    blurDataURL='/placeholder.webp'
                    unoptimized
                  />
                  <span>{credit.label}</span>
                </span>
              );
            })
          )}
        </div>
      </CSModal>
      <CSImageModal
        isOpen={isImageOpen}
        close={() => setIsImageOpen(false)}
        entity={entity}
      />
    </>
  );
}
