'use client';

import * as React from 'react';
import { isAuthTokenValid } from '@/utils/authToken';
import { logger } from '@/utils/defaultLogger';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';

import type { User } from '@/types/user';
import { cleanCache } from '@/lib/businessService';
import { auth, authClient } from '@/lib/client';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !isAuthTokenValid(token)) {
        cleanCache();
        localStorage.removeItem('authToken');
        setState({ user: null, error: null, isLoading: false });
        return;
      }

      await setPersistence(auth, browserLocalPersistence);

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        cleanCache();
        setState({ user: null, error: null, isLoading: false });
        return;
      }

      const { data, error } = await authClient.getUser();
      if (error) {
        logger.error(error);
        cleanCache();
        setState({ user: null, error, isLoading: false });
        return;
      }

      setState({ user: data ?? null, error: null, isLoading: false });
    } catch (err) {
      logger.error(err);
      cleanCache();
      setState({ user: null, error: 'Something went wrong', isLoading: false });
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err) => logger.error(err));
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
