import { Account } from "./auth/common";
import { Server, pingServers } from "./net/servers";

const GREEN_PING_FILTER = 'invert(49%) sepia(37%) saturate(7498%) hue-rotate(94deg) brightness(98%) contrast(105%)';
const YELLOW_PING_FILTER = 'invert(81%) sepia(71%) saturate(897%) hue-rotate(6deg) brightness(87%) contrast(101%)';
const RED_PING_FILTER = 'invert(16%) sepia(45%) saturate(5610%) hue-rotate(355deg) brightness(83%) contrast(127%)';

export const createServerList = (account: Account) => {
  const container = document.createElement('div');

  pingServers(account.userid, servers => {
    servers.forEach(server => {
      const serverDiv = findOrCreate(server, container);

      const playerCountElement = serverDiv.querySelector('#playercount');
      if (playerCountElement) {
        playerCountElement.innerHTML = (server.players || 0) >= 1000 ? 'FULL' : server.players?.toString() || 'x';
      }

      const pingElement = serverDiv.querySelector('#ping');
      if (pingElement) {
        pingElement.innerHTML = '';
        pingElement.appendChild(createPingIcon(server.ping || -1));
      }
    });
  });

  return container;
};

const findOrCreate = (server: Server, container: Node) => {
  let div = document.getElementById(`server_${server.name}`);

  if (div == null) {
    div = document.createElement('button');
    div.id = `server_${server.name}`;
    div.className = 'flex items-center flow-root w-80 bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 m-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
    div.hidden = false;
    div.innerHTML = `<span class="float-left">${server.name}</span><span class="float-right" id="ping"></span><span class="float-right mx-2" id="playercount">-1</span>`;
    container.appendChild(div);
  }

  return div;
}

const createPingIcon = (ping: number) => {
  const percent = 
      ping < 0 ? 0 : 
      ping < 50 ? 100 :
      ping < 100 ? 75 :
      ping < 200 ? 50 : 25;

  const container = document.createElement('div');
  container.style.height = '18px';

  const left = document.createElement('div');
  const right = document.createElement('div');

  [left, right].forEach(div => {
    div.style.display = 'inline-block';
    div.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/128/9498/9498764.png)';
    div.style.backgroundSize = '18px 18px';
    div.style.height = '18px';
    container.appendChild(div);
  });

  left.style.width = `${percent / 100 * 18}px`;
  right.style.width = `${(100 - percent) / 100 * 18}px`;
  right.style.backgroundPosition = 'right';

  left.style.filter = 
      percent >= 75 ? GREEN_PING_FILTER :
      percent >= 50 ? YELLOW_PING_FILTER : RED_PING_FILTER;

  return container;
}

