import { createContext } from 'react';
import Game from './game';

export const GameContext: React.Context<Game | undefined> = createContext(undefined as Game | undefined);