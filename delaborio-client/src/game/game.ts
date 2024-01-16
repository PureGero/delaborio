import { Account } from '../auth/common';
import Connection from '../net/connection';
import { Server } from '../net/servers';

export default class Game {
  server: Server;
  account: Account;
  connection: Connection;

  constructor(server: Server, account: Account) {
    this.server = server;
    this.account = account;

    this.connection = new Connection(server, this);
  }
}