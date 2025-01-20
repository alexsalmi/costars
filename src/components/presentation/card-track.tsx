'use client';
import useCostarsState from '@/store/costars.state';
import CSCard from './card';
import '@/styles/presentation/card-track.scss';
import Carousel from 'react-multi-carousel';
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from '@mui/icons-material';
import CSButton from '../inputs/buttons/button';

interface ICSCardTrackProps {
  showPrompt?: boolean;
  cards?: Array<GameEntity>;
  hints?: Array<Hint>;
  hideHints?: boolean;
  fullHeight?: boolean;
  condenseAll?: boolean;
  condenseEnds?: boolean;
  carouselCards?: Array<Array<GameEntity>>;
}

export default function CSCardTrack({
  showPrompt,
  cards,
  hints: propHints,
  hideHints,
  fullHeight,
  condenseAll,
  condenseEnds,
  carouselCards,
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
      {carouselCards ? (
        <>
          <CSCard entity={carouselCards[0][0]} condensed highlight />
          <Carousel
            responsive={{
              all: { breakpoint: { min: 0, max: 10000 }, items: 1 },
            }}
            containerClass='card-track-carousel-container'
            customLeftArrow={<CarouselArrow direction='left' />}
            customRightArrow={<CarouselArrow direction='right' />}
            showDots={false}
            minimumTouchDrag={25}
            customTransition='transform 200ms ease'
            transitionDuration={200}
          >
            {carouselCards.map((cards, ind) => {
              const trimmedCards = cards.slice(1, cards.length - 1);
              return (
                <div key={ind}>
                  {trimmedCards.map((entity) => {
                    return (
                      <CSCard
                        entity={entity}
                        reverse={entity.type === 'movie'}
                        key={entity.id}
                      />
                    );
                  })}
                </div>
              );
            })}
          </Carousel>
          <CSCard
            entity={carouselCards[0][carouselCards[0].length - 1]}
            condensed
            highlight
          />
        </>
      ) : (
        cardsToDisplay.map((entity, ind) => {
          return (
            <CSCard
              entity={entity}
              reverse={entity.type === 'movie'}
              condensed={
                condenseAll ||
                (condenseEnds &&
                  (ind === 0 || ind === cardsToDisplay.length - 1))
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
        })
      )}
    </div>
  );
}

interface ICSCarouselArrow {
  direction: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
}

function CarouselArrow({ direction, onClick, disabled }: ICSCarouselArrow) {
  return (
    <div className={`card-track-carousel-arrow ${direction}`}>
      <CSButton onClick={() => onClick!()} secondary disabled={disabled}>
        {direction === 'right' ? (
          <KeyboardArrowRightOutlined />
        ) : (
          <KeyboardArrowLeftOutlined />
        )}
      </CSButton>
    </div>
  );
}
