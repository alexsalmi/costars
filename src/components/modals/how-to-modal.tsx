import CSModal from './modal';
import '@/styles/modals/how-to-modal.scss';

interface ICSHowToModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function CSHowToModal({ isOpen, close }: ICSHowToModalProps) {
  return (
    <CSModal isOpen={isOpen} close={close} className='how-to-modal'>
      <h3>How to play</h3>
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
    </CSModal>
  );
}
