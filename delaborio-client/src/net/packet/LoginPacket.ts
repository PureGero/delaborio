import { Account } from "../../auth/common";
import Connection from "../connection";
import ChatPacket from "./ChatPacket";
import Packet from "./Packet";

export default class LoginPacket extends Packet {
  userid: string;
  username: string;
  avatar: string;
  displayName: string;
  accessToken: string;

  constructor(account: Account) {
    super();
    this.userid = account.userid;
    this.username = account.username;
    this.avatar = account.avatar;
    this.displayName = account.displayName;
    this.accessToken = account.accessToken;
  }

  handle(connection: Connection) {
    console.log('Logged in');
    connection.sendPacket(new ChatPacket('Hello world!'));
  }
}