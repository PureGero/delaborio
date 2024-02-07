import * as THREE from 'three';
import { Account } from '../auth/common';
import Connection from '../net/connection';
import { Server } from '../net/servers';
import Scene from './renderer/scene';
import World from './world';
import Player from './player';

export default class Game {
  server: Server;
  account: Account;
  connection: Connection;

  scene: Scene = new Scene();
  world: World = new World(this.scene);
  player: Player = new Player();

  lastTick: number = 0;
  keysDown: Set<number> = new Set();

  onChat: (message: string) => void = () => {};

  constructor(server: Server, account: Account) {
    this.server = server;
    this.account = account;
    this.connection = new Connection(server, this);
    this.world.addEntity(this.player);
  }

  tick() {
    const now = Date.now();
    const diff = Math.max(Math.min(now - this.lastTick, 1000), 0);
    this.lastTick = now;

    this.player.tick(this, diff);
  }
}