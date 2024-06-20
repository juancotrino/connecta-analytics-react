import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(100% 70% at 100% 100%, #f78e1e 0%, #231f20 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={20}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'right' }} variant="h1">
              Welcome to{' '}
              <Box component="span" sx={{ color: '#f78e1e' }}>
                Connecta Analytics
              </Box>
            </Typography>
            <Typography align="right" variant="subtitle1">
              A platform where you can have survey and studies insights and other useful tools to help you improve your
              productivity.
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Box
              component="img"
              alt="Widgets"
              src="/assets/auth-widgets.jpg"
              sx={{
                height: 'auto',
                width: '100%',
                maxWidth: '600px',
                opacity: 0.4,
              }}
            /> */}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
