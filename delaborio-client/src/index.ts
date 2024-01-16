import './index.css';
import { createLoginButton, createLogoutButton, fetchAccount } from './auth/discord';
import { createBackdrop, createNode, createWelcomeMessage } from './auth/common';
import { createServerList } from './server_list';

async function init() {
  const account = await fetchAccount();

  if (account == null) {
    if (document.getElementById('login_backdrop') == null) {
      const backdrop = createBackdrop();
      backdrop.id = 'login_backdrop';
      backdrop.appendChild(createWelcomeMessage());
      backdrop.appendChild(createLoginButton());
      document.body.innerHTML = '';
      document.body.appendChild(backdrop);
    }

    setTimeout(init, 1000);
    return;
  }

  const backdrop = createBackdrop();
  const img = document.createElement('img');
  img.className = 'rounded-full h-24 w-24 m-3 shadow-md';
  img.style.backgroundColor = 'white';
  img.src = account.avatar;
  backdrop.appendChild(img);
  backdrop.appendChild(createNode('span', 'text-center text-xl', `Welcome ${account.globalName}!`));
  backdrop.appendChild(createLogoutButton());
  backdrop.appendChild(createServerList(account));
  document.body.innerHTML = '';
  document.body.appendChild(backdrop);
}

setTimeout(init, 0);