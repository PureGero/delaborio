import { createContext } from 'react';
import { Account } from './common';

export const AccountContext: React.Context<Account> = createContext({
  userid: '',
  username: '',
  avatar: '',
  displayName: '',
  accessToken: ''
});