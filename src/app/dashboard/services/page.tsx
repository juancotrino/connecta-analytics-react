import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { paths } from '@/paths';
import { ServiceCard } from '@/components/dashboard/services/services-card';
import type { Service } from '@/components/dashboard/services/services-card';
import { CompaniesFilters } from '@/components/dashboard/services/services-filters';

export const metadata = { title: `Services | Dashboard | ${config.site.name}` } satisfies Metadata;

const services = [
  {
    id: 'SERV-006',
    title: 'Segment SPSS',
    description:
      "This tool helps to segment Connecta's databases (SPSS) to allow easy manipulation and particular analysis of different scenarios like the Chi2.",
    logo: '/assets/logo-segment-spss.png',
    pathname: paths.dashboard.services.segmentSpss,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'SERV-005',
    title: 'Transform to Belcorp',
    description:
      "This tool helps to convert Connecta's databases (SPSS) into the defualt format used by client Belcorp.",
    logo: '/assets/logo-transform-to-belcorp.png',
    pathname: paths.dashboard.services.transformToBelcorp,
    updatedAt: dayjs().subtract(43, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'SERV-004',
    title: 'NOEL Dashboard',
    description:
      'This is a dashboard where TP, B2B, JR and other metrics can be seen in a compact and easy to filter and understandlable way.',
    logo: '/assets/logo-noel-dashboard.png',
    pathname: paths.dashboard.services.noelDashboard,
    updatedAt: dayjs().subtract(50, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 'SERV-003',
    title: 'New Project Initialization',
    description:
      'This is a tool that allows the creation of a folder tree structure for a new project in a SharePoint directory that will be used by the Data Science team.',
    logo: '/assets/logo-new-project-initialization.png',
    pathname: paths.dashboard.services.newProjectInitialization,
    updatedAt: dayjs().subtract(7, 'minute').subtract(4, 'hour').subtract(1, 'day').toDate(),
  },
  {
    id: 'SERV-002',
    title: 'Miscellany Tools',
    description: 'Explore some miscellany tools for survey exploration and more.',
    logo: '/assets/logo-miscellany-tools.png',
    pathname: paths.dashboard.services.miscellanyTools,
    updatedAt: dayjs().subtract(31, 'minute').subtract(4, 'hour').subtract(5, 'day').toDate(),
  },
] satisfies Service[];

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Services</Typography>
          {/* <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Request new service
          </Button>
        </div>
      </Stack>
      <CompaniesFilters />
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid key={service.id} lg={4} md={6} xs={12}>
            <ServiceCard service={service} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={1} size="small" />
      </Box>
    </Stack>
  );
}
