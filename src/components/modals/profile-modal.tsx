import { signIn, signOut } from '@/services/auth.service';
import CSButton from '../inputs/button';
import CSModal from '../presentation/modal';
import useGameState from '@/store/game.state';
import { FacebookOutlined } from '@mui/icons-material';
import '@/styles/components/profile-modal.scss';
import Image from 'next/image';
import localStorageService from '@/services/localstorage.service';
import Link from 'next/link';

interface ICSProfileModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function CSProfileModal({
  isOpen,
  close,
}: ICSProfileModalProps) {
  const { user } = useGameState();

  const signInHandler = async (type: 'google' | 'facebook') => {
    localStorageService.setAuthStatus('pending');

    const error = await signIn(type);

    if (error) {
      localStorageService.setAuthStatus('false');
    }
  };

  const signOutHandler = async () => {
    const error = await signOut();

    if (!error) {
      localStorageService.setAuthStatus('false');
      localStorageService.clearStorage();
      window.location.reload();
    }
  };

  return (
    <CSModal isOpen={isOpen} close={close} className='profile-modal-container'>
      <h3>Profile</h3>
      {user ? (
        <>
          <span>Signed in as {user.email}</span>
          <CSButton secondary onClick={signOutHandler}>
            Sign Out
          </CSButton>
        </>
      ) : (
        <>
          <span>Sign in with one of the below providers:</span>
          <CSButton secondary onClick={() => signInHandler('google')}>
            <Image src='/g-logo.png' alt='Google Logo' width={24} height={24} />{' '}
            Sign in with Google
          </CSButton>
          <CSButton secondary onClick={() => signInHandler('facebook')}>
            <FacebookOutlined /> Login with Facebook
          </CSButton>
          <hr />
          <div className='profile-modal-why-section'>
            <h4>Why sign in?</h4>
            <span>
              Signing in will ensure none of your stats or streaks are lost, and
              will allow you to save your progress accross devices!
            </span>
            <span className='profile-modal-disclosure first'>
              Don&apos;t worry, your privacy is important to us. We don&apos;t
              collect any personal information other than the email address you
              choose to identify yourself with.
            </span>
            <span className='profile-modal-disclosure' onClick={close}>
              <Link href='/privacy' onClick={close}>
                Click here
              </Link>{' '}
              to view our Privacy Policy
            </span>
          </div>
        </>
      )}
    </CSModal>
  );
}
