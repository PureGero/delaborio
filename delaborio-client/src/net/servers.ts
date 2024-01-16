export interface Server {
  name: string;
  host: string;
  ssl?: boolean;
  ping?: number;
  players?: number;
  friends?: number;
  full?: boolean;
}

// Server names: Alpheratz, Bellatrix, Capella, Diphda, Elnath, Fomalhaut, Gacrux, Hamal, Kochab, Menkar, Nunki, Procyon, Rigel, Schedar, Vega, Zubenelgenubi
export const servers: Server[] = [
  {
    name: 'Alpheratz',
    host: 'alpheratz.justminecraft.net:2053',
    ssl: true,
  },
  {
    name: 'Bellatrix',
    host: 'bellatrix.justminecraft.net:2053',
    ssl: true,
  },
  {
    name: 'Capella',
    host: 'capella.justminecraft.net:2053',
    ssl: true,
  },
  {
    name: 'Diphda',
    host: 'diphda.justminecraft.net:2053',
    ssl: true,
  },
  {
    name: 'Dev',
    host: 'localhost:2052',
    ssl: false,
  },
  {
    name: 'Devssl',
    host: 'localhost:2053',
    ssl: true,
  }
]

export const pingServers = (userid: string, callback: (servers: Server[]) => void) => {
  servers.forEach(async server => {
    try {
      const url = `${server.ssl ? 'https' : 'http'}://${server.host}/ping`;

      // Preflight fetch to warm up the connection for better ping accuracy
      await fetch(`${url}`);

      const time = Date.now();
      const response = await fetch(`${url}?id=${userid}`);
      const data = await response.json();
      server.ping = (Date.now() - time) || 1; // 0 ping breaks things lol
      server.players = data.players;
      server.friends = data.friends;
      server.full = data.full;
      console.log(server);
      callback(servers);
    } catch (e) {}
  });

  callback(servers);
}