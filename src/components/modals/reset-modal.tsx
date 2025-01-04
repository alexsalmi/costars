import CSModal from './modal';
import CSButton from '../inputs/buttons/button';
import useCostarsState from '@/store/costars.state';
import '@/styles/modals/reset-modal.scss';

interface ICSResetModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function CSResetModal({ isOpen, close }: ICSResetModalProps) {
  const { reset } = useCostarsState();

  const confirm = () => {
    reset();
    close();
  };

  return (
    <CSModal isOpen={isOpen}>
      <h4>Warning!</h4>
      <span>
        You will lose all your progress in your current game if you reset.
      </span>
      <div className='reset-modal-buttons'>
        <CSButton secondary onClick={close}>
          Cancel
        </CSButton>
        <CSButton onClick={confirm}>Reset</CSButton>
      </div>
    </CSModal>
  );
}
