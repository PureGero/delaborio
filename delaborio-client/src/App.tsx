import { useState } from 'react';
import { Account } from './auth/common';
import Backdrop from './server_list/Backdrop';
import { DiscordLoginButton, DiscordLogoutButton } from './auth/discord';
import { AccountContext } from './auth/AccountContext';
import ServerList from './server_list/ServerList';
import Game from './game/game';
import { GameContext } from './game/GameContext';
import GameUI from './game/GameUI';
import { PlayerData } from './game/player';
import { PlayerDataContext } from './game/PlayerDataContext';
import { fetchPlayerData } from './net/playerDataFetcher';

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  const onLogin = async (account: Account) => {
    setAccount(account);

    setPlayerData(await fetchPlayerData(account));
  };

  return (
    <div>
      {
        game != null ? (
          <GameContext.Provider value={game}>
            <GameUI />
          </GameContext.Provider>
        ) : account == null ? (
          <Backdrop>
            <h1 className="text-2xl">Welcome to Delaborio!</h1>Please log in to start playing<br/>
            <DiscordLoginButton onLogin={onLogin} />
          </Backdrop>
        ) : playerData == null ? (
          <AccountContext.Provider value={account}>
            <Backdrop>
              <img alt="Your avatar" src={account.avatar} className="bg-white rounded-full h-24 w-24 m-3 shadow-md"></img>
              <span className="text-center text-xl">Logging in...</span>
            </Backdrop>
          </AccountContext.Provider>
        ) : (
          <AccountContext.Provider value={account}>
            <PlayerDataContext.Provider value={playerData}>
              <Backdrop>
                <img alt="Your avatar" src={account.avatar} className="bg-white rounded-full h-24 w-24 m-3 shadow-md"></img>
                <span className="text-center text-xl">Welcome {account.displayName}!</span>
                <DiscordLogoutButton />
                <ServerList joinServer={server => {
                  const game = new Game(server, account);
                  game.connection.initConnection();
                  setGame(game)
                }} />
              </Backdrop>
            </PlayerDataContext.Provider>
          </AccountContext.Provider>
        )
      }
      <div className="absolute right-0 bottom-0 opacity-50 text-xs m-1">
        <small>Version: {process.env.REACT_APP_GIT_SHA}</small>
      </div>
    </div>
  );
}

export default App;
