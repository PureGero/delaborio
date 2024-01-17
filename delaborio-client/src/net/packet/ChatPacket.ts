import Connection from "../connection";
import Packet from "./Packet";

export default class ChatPacket extends Packet {
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  handle(connection: Connection) {
    console.log(`[CHAT] ${this.message}`);
    connection.game.onChat(this.message);
  }
}