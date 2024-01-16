import { useState } from 'react';
import { Account } from './auth/common';
import Backdrop from './server_list/Backdrop';
import { DiscordLoginButton, DiscordLogoutButton } from './auth/discord';
import { AccountContext } from './auth/AccountContext';
import ServerList from './server_list/ServerList';
import Game from './game/game';
import { GameContext } from './game/GameContext';

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  return (
    <div>
      {
        game != null ? (
          <GameContext.Provider value={game}>
            <Backdrop>
              [game goes here]
            </Backdrop>
          </GameContext.Provider>
        ) : account == null ? (
          <Backdrop>
            <h1 className="text-2xl">Welcome to Delaborio!</h1>Please log in to start playing<br/>
            <DiscordLoginButton onLogin={setAccount} />
          </Backdrop>
        ) : (
          <AccountContext.Provider value={account}>
            <Backdrop>
              <img alt="Your avatar" src={account.avatar} className="bg-white rounded-full h-24 w-24 m-3 shadow-md"></img>
              <span className="text-center text-xl">Welcome {account.globalName}!</span>
              <DiscordLogoutButton />
              <ServerList joinServer={server => setGame(new Game(server, account))} />
            </Backdrop>
          </AccountContext.Provider>
        )
      }
    </div>
  );
}

export default App;
