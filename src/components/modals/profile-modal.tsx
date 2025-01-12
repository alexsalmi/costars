import {
  deleteAccount,
  signIn,
  signOut,
} from '@/services/supabase/auth.service';
import CSButton from '../inputs/buttons/button';
import CSModal from './modal';
import useCostarsState from '@/store/costars.state';
import Image from 'next/image';
import Link from 'next/link';
import { ls_PostAuthStatus } from '@/services/localstorage';
import { clearStorage } from '@/utils/localstorage';
import '@/styles/modals/profile-modal.scss';
import { useState } from 'react';
import ExpandableContent from '../presentation/expandable-content';

interface ICSProfileModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function CSProfileModal({
  isOpen,
  close,
}: ICSProfileModalProps) {
  const { user } = useCostarsState();
  const [deleteState, setDeleteState] = useState<'not-started' | 'confirming'>(
    'not-started',
  );
  const [confirmValue, setConfirmValue] = useState('');

  const handleClose = () => {
    setDeleteState('not-started');
    close();
  };

  const signInHandler = async (type: 'google') => {
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

  const deleteHandler = async () => {
    if (confirmValue !== 'delete') return;

    const error = await deleteAccount();

    console.log(error);

    if (!error) {
      ls_PostAuthStatus('false');
      clearStorage();
      window.location.reload();
    }
  };

  return (
    <CSModal
      isOpen={isOpen}
      close={handleClose}
      className='profile-modal-container'
    >
      {user ? (
        <>
          <h3>Profile</h3>
          <span>
            Signed in as <strong>{user.email}</strong>
          </span>
          <CSButton onClick={signOutHandler}>Sign Out</CSButton>
          <div className='profile-modal-settings-container'>
            <h3>Settings</h3>
            <ExpandableContent label='Danger Section'>
              {deleteState === 'not-started' ? (
                <>
                  <span>
                    Any actions performed here are{' '}
                    <strong>irreversible.</strong>
                  </span>
                  <CSButton
                    secondary
                    onClick={() => setDeleteState('confirming')}
                  >
                    Delete your account
                  </CSButton>
                </>
              ) : (
                <>
                  <span>
                    <strong>NOTE:</strong> deleting your account is{' '}
                    <strong>PERMANENT.</strong> All of your Costars data and
                    stats will be lost forever.
                  </span>
                  <span>
                    To confirm your account deletion, please type{' '}
                    <i>&apos;delete&apos;</i> into the textbox below.
                  </span>
                  <input
                    type='text'
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                  />
                  <CSButton secondary onClick={deleteHandler}>
                    Confirm Account Deletion
                  </CSButton>
                </>
              )}
            </ExpandableContent>
          </div>
        </>
      ) : (
        <>
          <h3>Sign In</h3>
          <span>Sign in below to sync your stats accross devices:</span>
          <div className='google-button'>
            <CSButton secondary onClick={() => signInHandler('google')}>
              <Image
                priority
                src='/g-logo.png'
                alt='Google Logo'
                width={24}
                height={24}
              />{' '}
              Sign in with Google
            </CSButton>
          </div>
          <div className='profile-modal-faq-section'>
            <h3>FAQs</h3>
            <ExpandableContent label='Why sign in?'>
              <span>
                Signing in will ensure none of your stats or streaks are lost,
                and will allow you to save your progress accross devices!
              </span>
              <span className='profile-modal-disclosure first'>
                Don&apos;t worry, your privacy is important to us. We don&apos;t
                collect any personal information other than the email address
                you choose to identify yourself with.
              </span>
              <span className='profile-modal-disclosure' onClick={close}>
                <Link href='/privacy' onClick={close}>
                  Click here
                </Link>{' '}
                to view our Privacy Policy
              </span>
            </ExpandableContent>
          </div>
        </>
      )}
    </CSModal>
  );
}
