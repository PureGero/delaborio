import { Account } from "./common";

const url = 'https://discord.com/oauth2/authorize?client_id=1196307692394905680&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord.html&scope=identify';

const discordLogo = `<svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
<g>
    <path
        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        fill="#5865F2" fill-rule="nonzero">

    </path>
</g>
</svg>`;

export const fetchAccount = async (): Promise<Account | null> => {
  const token = window.localStorage.getItem('discord_token');

  if (token == null) {
    return null;
  } else {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const json = await response.json();
    return {
      userid: `discord-${json.id}`,
      username: json.username,
      avatar: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png`,
      globalName: json.global_name,
      accessToken: token,
    };
  }
}

export const getOauthUrl = () => {
  return url;
}

export const createLoginButton = () => {
  const button = document.createElement('a');
  button.target = '_blank';
  button.href = getOauthUrl();
  button.className = 'flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 m-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
  button.innerHTML = discordLogo + '<span>Login with Discord</span>';
  return button;
}

export const createLogoutButton = () => {
  const button = document.createElement('button');
  button.className = 'flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 m-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
  button.innerHTML = '<span>Logout</span>';
  button.onclick = () => {
    window.localStorage.removeItem('discord_token');
    window.location.reload();
  }
  return button;
}