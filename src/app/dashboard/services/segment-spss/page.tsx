import type { Metadata } from 'next';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';

export const metadata = { title: `Services | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Segment SPSS</Typography>
        </Stack>
        <div>
          <Button startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Back to services
          </Button>
        </div>
      </Stack>
    </Stack>
  );
}
