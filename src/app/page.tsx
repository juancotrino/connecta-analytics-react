'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthTokenValid } from '@/utils/authToken';

import { paths } from '@/paths';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isAuthTokenValid(token)) {
      router.replace(paths.welcome);
    } else {
      router.replace(paths.auth.signIn);
    }
  }, [router]);

  return null;
}
