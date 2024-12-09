import Home from "@/app/(home)/home";
import CSCustomGameModal from "@/components/game/custom-game-modal";

export default function NewCustomGame() {
  return (
    <>
      <CSCustomGameModal />
      <Home starter={{} as GameEntity} target={{} as GameEntity}/>
    </>
  );
}
