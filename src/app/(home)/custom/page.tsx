import Home from "@/app/(home)/page";
import CSCustomGameModal from "@/components/game/custom-game-modal";

export default function NewCustomGame() {
  return (
    <>
      <CSCustomGameModal />
      <Home placeholder/>
    </>
  );
}
