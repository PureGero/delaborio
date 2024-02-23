import { Account } from "../auth/common";
import { PlayerData } from "../game/player";
import { servers } from "./servers";

export const fetchPlayerData = async (account: Account): Promise<PlayerData> => {
  let closestServerName = window.localStorage.getItem('closest_server');

  return await fetchPlayerDataFromServer(account, closestServerName);
};

const fetchPlayerDataFromServer = async (account: Account, serverName?: string | null): Promise<PlayerData> => {
  if (!serverName) {
    serverName = pickRandomServerName();
  }

  const server = servers.find(s => s.name === serverName);

  try {
    if (!server) {
      throw new Error(`Server ${serverName} not found`);
    }

    const url = `${server.ssl ? 'https' : 'http'}://${server.host}/fetchdata`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid: account.userid, accessToken: account.accessToken }),
    });

    if (response.status !== 200) {
      // Invalid token
      throw new Error(`Failed to fetch player data from ${serverName}: Status code ${response.status}`);
    }

    const json = await response.json();
    return json as PlayerData;
  } catch (e) {
    console.error(e);
    return fetchPlayerDataFromServer(account);
  }
};

const pickRandomServerName = () => {
  return servers[Math.floor(Math.random() * servers.length)].name;
}