import CSButton from '../inputs/buttons/button';
import CSModal from './modal';
import '@/styles/modals/save-conflict-modal.scss';

interface ICSSaveConflictModalProps {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

export default function CSSaveConflictModal({
  isOpen,
  handleOk,
  handleCancel,
}: ICSSaveConflictModalProps) {
  return (
    <CSModal isOpen={isOpen}>
      <h3>Warning!</h3>
      <span>
        Your local save data will be overwritten if you sign into this existing
        account. Continue anyway?
      </span>

      <div className='save-conflict-modal-buttons'>
        <CSButton secondary onClick={handleCancel}>
          Cancel
        </CSButton>
        <CSButton onClick={handleOk}>Ok</CSButton>
      </div>
    </CSModal>
  );
}
