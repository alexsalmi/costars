import '@/styles/components/reset-modal.scss'
import CSModal from '../presentation/modal';
import CSButton from '../inputs/button';
import useGameState from '@/store/game.state';

interface ICSResetModalProps {
	isOpen: boolean,
	close: () => void
}

export default function CSResetModal({ isOpen, close }: ICSResetModalProps) {
	const { reset } = useGameState();

	const confirm = () => {
		reset();
		close();
	}

  return (
		<CSModal isOpen={isOpen}>
			<h4>Warning!</h4>
			<span>
				You will lose all your progress in your current game if you reset.
			</span>
			<div className="reset-modal-buttons">
				<CSButton 
					secondary
					onClick={close}
				>
					Cancel
				</CSButton>
				<CSButton
					onClick={confirm}
				>
					Reset
				</CSButton>
			</div>
		</CSModal>
  );
}
