import Chat from "./gui/Chat";
import Renderer from "./renderer/Renderer";

export default function GameUI() {
  return (
    <div>
      <Renderer />
      <Chat />
    </div>
  )
}