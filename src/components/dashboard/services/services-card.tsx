import * as React from 'react';
import { Button, CardActionArea } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import type { NavItemConfig } from '@/types/nav';
import { colorSchemes } from '@/styles/theme/color-schemes';

import { navItems } from './config';

export interface Service {
  id: string;
  title: string;
  description: string;
  logo: string;
  pathname: string;
  updatedAt: Date;
}

export interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps): React.JSX.Element {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea
        sx={{
          '--Card-color': colorSchemes.light.palette.primary.main,
          color: 'var(--Card-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
        href={service.pathname}
      >
        <CardContent sx={{ flex: '1 1 auto' }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
              <Avatar
                src={service.logo}
                variant="square"
                sx={{
                  height: '150px',
                  width: '150px',
                  // Equivalent color to colorSchemes.light.palette.primary[100]
                  filter: 'invert(5%) sepia(1%) saturate(6276%) hue-rotate(295deg) brightness(93%) contrast(83%)',
                }}
              />
            </Box>
            <Stack spacing={1} sx={{ flexGrow: 1, justifyContent: 'center' }}>
              <Typography
                align="center"
                variant="h5"
                className="card-title"
                sx={{ color: colorSchemes.light.palette.primary[100] }}
              >
                {service.title}
              </Typography>
              <Typography
                align="center"
                variant="body1"
                className="card-description"
                sx={{ color: colorSchemes.light.palette.primary[100] }}
              >
                {service.description}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
