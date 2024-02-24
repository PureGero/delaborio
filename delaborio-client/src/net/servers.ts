import { PlayerData } from "../game/player";

export interface Server {
  name: string;
  host: string;
  hidden?: boolean;
  ssl?: boolean;
  ping?: number;
  players?: number;
  friends?: number;
  full?: boolean;
  gitHash?: string;
  errorMessage?: string;
}

// Server names: Alpheratz, Bellatrix, Capella, Diphda, Elnath, Fomalhaut, Gacrux, Hamal, Kochab, Menkar, Nunki, Procyon, Rigel, Schedar, Vega, Zubenelgenubi
export const servers: Server[] = [
  {
    name: 'Alpheratz 🇺🇸',
    host: 'alpheratz.justminecraft.net:2053',
    ssl: true,
  },
  {
    name: 'Bellatrix 🇦🇺',
    host: 'bellatrix.justminecraft.net:2053',
    ssl: true,
  },
  {
    name: 'Localhost',
    host: 'localhost:2052',
    hidden: true,
    ssl: false,
  },
  {
    name: 'Localhostssl',
    host: 'localhost:2053',
    hidden: true,
    ssl: true,
  }
]

export const pingServers = (playerData: PlayerData, callback: (servers: Server[]) => void) => {
  let setClosestServer = false;

  servers.forEach(async server => {
    try {
      const url = `${server.ssl ? 'https' : 'http'}://${server.host}/ping`;

      // Preflight fetch to warm up the connection for better ping accuracy
      // Use post for preflight fetch to ensure the OPTIONS request is already sent and cached
      await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const time = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: playerData.uuid,
          friends: playerData.friends,
          gitHash: process.env.REACT_APP_GIT_SHA
        }),
      });

      const data = await response.json();
      server.ping = (Date.now() - time) || 1; // 0 ping breaks things lol
      server.players = data.players;
      server.friends = data.friends;
      server.full = data.full;
      server.gitHash = data.gitHash;

      server.errorMessage =
          data.gitHash && data.gitHash !== process.env.REACT_APP_GIT_SHA && !data.gitHash.includes('dirty') ? 'OUTDATED' :
          data.full ? 'FULL' :
          undefined;

      console.log(server);
      callback(servers);

      if (data.alive && !setClosestServer) {
        setClosestServer = true;
        window.localStorage.setItem('closest_server', server.name);
      }
    } catch (e) {}
  });

  callback(servers);
}