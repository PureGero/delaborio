import { Account } from "../../auth/common";
import Packet from "./Packet";

export default class LoginPacket extends Packet {
  userid: string;
  username: string;
  avatar: string;
  globalName: string;
  accessToken: string;

  constructor(account: Account) {
    super();
    this.userid = account.userid;
    this.username = account.username;
    this.avatar = account.avatar;
    this.globalName = account.globalName;
    this.accessToken = account.accessToken;
  }
}