'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';

import { MobileNav } from './MobileNav';
import { UserMenu } from './userMenu';
import { Typography } from '@mui/material';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();
  const { user } = useUser();

  // TODO: implement this
  const getInitials = (): string => {
    return 'JC';
  }

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>

          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Typography variant="subtitle1" sx={{ display: { xs: 'none', lg: 'block' } }}>
              {user?.name ?? 'User Name'}
            </Typography>
            <Avatar onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              sx={{ cursor: 'pointer', bgcolor: 'var(--mui-palette-primary-main)' }}>
              {getInitials()}
            </Avatar>
          </Stack>
        </Stack>
      </Box>

      <UserMenu anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose} open={userPopover.open} />

      <MobileNav
        onClose={() => { setOpenNav(false); }}
        open={openNav}
      />
    </React.Fragment>
  );
}
