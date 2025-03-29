import { useState } from 'react';
import CSButton from '../inputs/buttons/button';
import CSModal from './modal';
import '@/styles/modals/info-modal.scss';
import ExpandableContent from '../presentation/expandable-content';

interface ICSInfoModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function CSInfoModal({ isOpen, close }: ICSInfoModalProps) {
  const [selectedTab, setSelectedTab] = useState<'how-to' | 'faq'>('how-to');

  return (
    <CSModal isOpen={isOpen} close={close} className='info-modal'>
      <div className='info-modal-tabs'>
        <CSButton
          secondary
          selected={selectedTab === 'how-to'}
          onClick={() => setSelectedTab('how-to')}
        >
          <h4>How to play</h4>
        </CSButton>
        <CSButton
          secondary
          selected={selectedTab === 'faq'}
          onClick={() => setSelectedTab('faq')}
        >
          <h4>FAQs</h4>
        </CSButton>
      </div>
      {selectedTab === 'how-to' ? <HowToContent /> : <FAQContent />}
    </CSModal>
  );
}

function HowToContent() {
  return (
    <>
      <span>
        Match the two given actors using movies they&apos;ve been in, using as
        few movies as possible!
      </span>
      <span>
        Start by searching for a movie that your starting actor has been in,
        then search for another actor that was also in the same movie. Continue
        this process until you reach the target actor.
      </span>
      <span>There is no limit to how many guesses you can make.</span>
      <span>
        If you&apos;re feeling stuck, click on any actor/movie&apos;s card to be
        presented with a brief description of them and the option to use a hint
        to see their credits.
      </span>
      <h3>Game Modes</h3>
      <h4>Daily Costars</h4>
      <span>
        Every day at midnight EST, a new pair of actors will be picked as the
        daily costars. Try to match them in as few movies as possible to keep
        your streak going!
      </span>
      <span>
        It is always possible to connect the daily costars in 2 movies. The
        daily costars will never have starred in a movie together.
      </span>
      <h4>Custom Game</h4>
      <span>
        Pick your own two actors to connect, and share it with your friends!
      </span>
      <span>
        There are no limitations to which actors you can choose for a custom
        game.
      </span>
      <h4>Unlimited</h4>
      <span>
        Connect as many actors and movies as you can to get the highest score
        possible!
      </span>
    </>
  );
}

function FAQContent() {
  return (
    <>
      <ExpandableContent label='What is Costars?'>
        <span>
          Costars is a movie trivia game, challenging players to connect two
          actors by the movies they&apos;ve starred in and the costars
          they&apos;ve worked with.
        </span>
      </ExpandableContent>
      <ExpandableContent label='How often do the Daily Costars update?'>
        <span>
          A new set of Daily Costars will be available every day at 12:00 AM
          EST.
        </span>
      </ExpandableContent>
      <ExpandableContent label='How are the Daily Costars selected?'>
        <span>
          The Daily Costars are selected randomly from a pool of the 200 most
          popular actors at the time, according to the TMDB API. The Daily
          Costars are generated on a weekly basis, and no actors will be reused
          within that given week. All pairings for a week are sorted by
          the number of optimal solutions, so that the difficulty
          increases as the week progresses. There will never be a repeated Daily
          Costars pairing.
        </span>
      </ExpandableContent>
      <ExpandableContent label='How do I use a hint?'>
        <span>
          To use a hint, click on any movie or actor&apos;s card, and you will
          be given the option to use a hint to view their credits. Please note
          that any hint used on a movie or actor used in your final solution
          will count towards your score. If you use a hint and connect a pair of
          Costars in two movies, it will not count as a Perfect Game.
        </span>
      </ExpandableContent>
      <ExpandableContent label='I want to play more than one game a day, is that possible?'>
        <span>
          Yes, you can access the archive of Daily Costars by clicking on the
          calendar icon at the top of the page. You can also play a Custom Game
          to choose your own pair of actors to connect, which you can also share
          with your friends.
        </span>
      </ExpandableContent>
      <ExpandableContent label='Can I play on multiple devices?'>
        <span>
          Yes, you can play accross multiple devices and keep your streaks going
          if you create an account with us. To do so, click on the profile icon
          at the top of the page. We do not collect any personal data other than
          the email address you choose to identify yourself with. Accounts are
          only used for syncing your Costars stats and streaks accross devices.
        </span>
      </ExpandableContent>
    </>
  );
}
