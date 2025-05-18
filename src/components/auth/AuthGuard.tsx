'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { isAuthTokenValid } from '@/utils/authToken';
import { logger } from '@/utils/defaultLogger';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState(true);
  const [tokenError, setTokenError] = React.useState<string | null>(null);

  const checkPermissions = async () => {
    if (isLoading) return;

    const token = localStorage.getItem('authToken');
    if (!token || !isAuthTokenValid(token)) {
      logger.debug('[AuthGuard]: No valid token found, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      logger.debug('[AuthGuard]: No Firestore user found, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
  }, [user, error, isLoading]);

  if (isChecking) return null;

  if (error || tokenError) {
    return <Alert severity="error">{error || tokenError}</Alert>;
  }

  return <>{children}</>;
}
