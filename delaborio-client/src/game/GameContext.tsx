import { createContext } from 'react';
import Game from './game';

export const GameContext: React.Context<Game> = createContext(new Game(
  {
    name: 'Test',
    host: 'localhost:2052',
  },
  {
    userid: 'fake',
    username: 'fake',
    avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.png',
    globalName: 'Fake',
    accessToken: 'fake',
  }
));