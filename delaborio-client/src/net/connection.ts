import Game from "../game/game";
import LoginPacket from "./packet/LoginPacket";
import Packet from "./packet/Packet";
import packets from "./packet/packets";
import { Server } from "./servers";

export default class Connection {
  server: Server;
  game: Game;
  socket: WebSocket | undefined;

  constructor(server: Server, game: Game) {
    this.server = server;
    this.game = game;
  }

  initConnection() {
    this.socket = new WebSocket(`${this.server.ssl ? 'wss' : 'ws'}://${this.server.host}/websocket`);

    this.socket.onmessage = event => {
      const type = event.data.substring(0, event.data.indexOf('\n'));
      const json = event.data.substring(event.data.indexOf('\n') + 1);
      const data = JSON.parse(json);

      if (type in packets) {
        const packet = Object.assign(new packets[type](), data);
        packet.handle(this);
      }
    }
    this.socket.onopen = event => {
      console.log('Connected to server');
      this.sendPacket(new LoginPacket(this.game.account));
    }
    this.socket.onclose = event => {
      console.log('Disconnected from server');
    }
  }

  sendPacket(packet: Packet) {
    this.socket?.send(`${packet.constructor.name}\n${JSON.stringify(packet)}`);
  }
}