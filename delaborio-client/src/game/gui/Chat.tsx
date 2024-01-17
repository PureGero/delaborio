import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { GameContext } from "../GameContext";
import ChatPacket from "../../net/packet/ChatPacket";

interface ChatMessage {
  uuid: string;
  message: string;
  timestamp: number;
}

export default function Chat() {
  const game = useContext(GameContext);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  const sendChat = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      message: { value: string };
    };
    const message = target.message.value;
    target.message.value = '';
    game.connection.sendPacket(new ChatPacket(message));
  }

  const lastMessageRef = useRef(null) as React.MutableRefObject<HTMLSpanElement | null>;
  useEffect(() => {
    const lastMessage = lastMessageRef.current;
    if (lastMessage && (lastMessage.offsetTop || 0) - (lastMessage.parentElement?.clientHeight || 0) - (lastMessage.parentElement?.scrollTop || 0) < 25) {
      lastMessage.scrollIntoView();
    }
  }, [chatLog]);
  
  useEffect(() => {
    game.onChat = message => {
      setChatLog(chatLog => {
        const newChatLog = chatLog.slice(-100, 100); // Only keep the last 100 messages
        newChatLog.push({
          uuid: uuidv4(),
          message,
          timestamp: Date.now()
        });
        return newChatLog;
      });
    }
  }, [game]);

  return (
    <div className="absolute bottom-0 left-0 my-16 mx-1 w-96">
      <div className="flex flex-col items-left border border-gray-200 h-48 p-1 overflow-y-scroll">
        <span key="first" className="mt-auto"></span>
        {chatLog.map(message => (<span key={message.uuid}>{message.message}</span>))}
        <span key="last" ref={lastMessageRef}></span>
      </div>
      <form onSubmit={sendChat} className="flex">
        <input type="text" autoComplete="off" name="message" className="border border-gray-300 px-1 flex-grow" />
        <button type="submit" className="border border-gray-300 px-1">Send</button>
      </form>
    </div>
  )
}