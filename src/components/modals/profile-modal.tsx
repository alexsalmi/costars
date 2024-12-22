import { login, signOut } from '@/services/auth.service';
import CSButton from '../inputs/button';
import CSModal from '../presentation/modal';
import useGameState from '@/store/game.state';
import { FacebookOutlined, Google } from '@mui/icons-material';
import '@/styles/components/profile-modal.scss'

interface ICSProfileModalProps {
	isOpen: boolean,
	close: () => void
}

export default function CSProfileModal({ isOpen, close }: ICSProfileModalProps) {
  const { user } = useGameState();
  
  const signOutHandler = async () => {
    const error = await signOut();

    if (!error)
      window.location.reload();
  }

  return (
		<CSModal isOpen={isOpen} close={close} className='profile-modal-container'>
      <h3>Profile</h3>
      {user ?
        <>
          <span>Signed in as {user.email}</span>
          <CSButton onClick={signOutHandler}>
              Sign Out
          </CSButton>
        </>  
        :
        <>
          <span>Sign in with one of the below providers:</span>
          <CSButton secondary onClick={() => login('google')}>
            <Google /> Google
          </CSButton>
          <CSButton secondary onClick={() => login('facebook')}>
            <FacebookOutlined /> Facebook
          </CSButton>
          <hr />
          <h4>Why sign in?</h4>
          <span>Signing in will ensure none of your stats or streaks are lost, and will allow you to save your progress accross devices!</span>
        </>
      }
		</CSModal>
  );
}
