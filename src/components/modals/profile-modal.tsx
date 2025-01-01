import { signIn, signOut } from '@/services/supabase/auth.service';
import CSButton from '../inputs/buttons/button';
import CSModal from './modal';
import useCostarsState from '@/store/costars.state';
import { FacebookOutlined } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { ls_PostAuthStatus } from '@/services/localstorage';
import { clearStorage } from '@/utils/localstorage';
import '@/styles/modals/profile-modal.scss';

interface ICSProfileModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function CSProfileModal({
  isOpen,
  close,
}: ICSProfileModalProps) {
  const { user } = useCostarsState();

  const signInHandler = async (type: 'google' | 'facebook') => {
    ls_PostAuthStatus('pending');

    const error = await signIn(type);

    if (error) {
      ls_PostAuthStatus('false');
    }
  };

  const signOutHandler = async () => {
    const error = await signOut();

    if (!error) {
      ls_PostAuthStatus('false');
      clearStorage();
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
