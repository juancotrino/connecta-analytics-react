import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTableCell = {
  styleOverrides: {
    root: { borderBottom: 'var(--TableCell-borderWidth, 1px) solid var(--mui-palette-TableCell-border)' },
    paddingCheckbox: { padding: '0 0 0 24px' },
    sizeSmall: {
      padding: '6px 10px',
      '&.MuiTableCell-head': {
        padding: '10px',
      },
    },
  },
} satisfies Components<Theme>['MuiTableCell'];
