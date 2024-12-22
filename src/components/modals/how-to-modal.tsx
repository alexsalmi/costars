import CSModal from '../presentation/modal';

interface ICSHowToModalProps {
	isOpen: boolean,
	close: () => void
}

export default function CSHowToModal({ isOpen, close }: ICSHowToModalProps) {
  return (
		<CSModal isOpen={isOpen} close={close}>
      <h3>How to play</h3>
      <span>Coming soon, stay tuned for instructions on how to play!</span>
		</CSModal>
  );
}
