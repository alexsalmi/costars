import Home from '@/app/(home)/page';
import CSCustomGameModal from '@/components/modals/custom-game-modal';

export default function NewCustomGame() {
  return (
    <>
      <CSCustomGameModal />
      <Home />
    </>
  );
}
