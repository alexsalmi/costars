'use client';
import useCostarsState from '@/store/costars.state';
import CSCard from './card';
import '@/styles/presentation/card-track.scss';

interface ICSCardTrackProps {
  showPrompt?: boolean;
  cards?: Array<GameEntity>;
  hints?: Array<Hint>;
  hideHints?: boolean;
  fullHeight?: boolean;
  condenseAll?: boolean;
  condenseEnds?: boolean;
}

export default function CSCardTrack({
  showPrompt,
  cards,
  hints: propHints,
  hideHints,
  fullHeight,
  condenseAll,
  condenseEnds,
}: ICSCardTrackProps) {
  const { history, hints, current } = useCostarsState();

  const cardsToDisplay = cards || history;
  const hintsToDisplay = propHints || hints;

  return (
    <div
      className={`card-track-container ${!showPrompt ? 'no-prompt' : ''} ${fullHeight ? 'full-height' : ''}`}
    >
      {showPrompt ? (
        <span className='card-track-prompt'>
          {!current
            ? 'Enter any actor to begin!'
            : history.length === 1
              ? `What has ${current.label} been in?`
              : current.type === 'person'
                ? `What else has ${current.label} been in?`
                : `Who else was in ${current.label}?`}
        </span>
      ) : (
        <></>
      )}
      {cardsToDisplay.map((entity, ind) => {
        return (
          <CSCard
            entity={entity}
            reverse={entity.type === 'movie'}
            condensed={
              condenseAll ||
              (condenseEnds && (ind === 0 || ind === cardsToDisplay.length - 1))
            }
            hintUsed={hintsToDisplay.some(
              (hint) => hint.id === entity.id && hint.type === entity.type,
            )}
            key={entity.id}
            hideHints={hideHints}
            highlight={
              condenseEnds && (ind === 0 || ind === cardsToDisplay.length - 1)
            }
          />
        );
      })}
    </div>
  );
}
