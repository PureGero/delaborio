import Game from "../game/game";
import ChatPacket from "./packet/ChatPacket";
import LoginPacket from "./packet/LoginPacket";
import Packet from "./packet/Packet";
import packets from "./packet/packets";
import { Server } from "./servers";

export default class Connection {
  server: Server;
  game: Game;
  socket: WebSocket;

  constructor(server: Server, game: Game) {
    this.server = server;
    this.game = game;

    this.socket = this.initConnection();
  }

  initConnection() {
    const socket = new WebSocket(`${this.server.ssl ? 'wss' : 'ws'}://${this.server.host}/websocket`);

    socket.onmessage = event => {
      const type = event.data.substring(0, event.data.indexOf('\n'));
      const json = event.data.substring(event.data.indexOf('\n') + 1);
      const data = JSON.parse(json);

      if (type in packets) {
        const packet = Object.assign(new packets[type](), data);
        packet.handle(this);
      }
    }
    socket.onopen = event => {
      console.log('Connected to server');
      this.sendPacket(new LoginPacket(this.game.account));
      this.sendPacket(new ChatPacket('Hello world!'));
    }
    socket.onclose = event => {
      console.log('Disconnected from server');
    }

    return socket;
  }

  sendPacket(packet: Packet) {
    this.socket.send(`${packet.constructor.name}\n${JSON.stringify(packet)}`);
  }
}