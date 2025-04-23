'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/utils/defaultLogger';
import { useUser } from '@/hooks/use-user';
import { isAuthTokenValid } from '@/utils/authToken';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) return;

    if (error) {
      setIsChecking(false);
      return;
    }

    const token = localStorage.getItem('authToken');

    if (user && token && isAuthTokenValid(token)) {
      logger.debug('[GuestGuard]: User is logged in with valid token, redirecting to dashboard');
      router.replace(paths.welcome); // TODO: change this in the future
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error, isLoading]);

  if (isChecking) return null;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return <>{children}</>;
}
