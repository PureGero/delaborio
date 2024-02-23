import { createContext } from 'react';
import { PlayerData } from './player';

export const PlayerDataContext: React.Context<PlayerData> = createContext({
  uuid: '',
  username: '',
  displayName: '',
  avatarUrl: '',
  xp: 0,
  level: 0,
  friends: new Map(),
  playTimeSeconds: 0,
});