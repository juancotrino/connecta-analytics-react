import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";


interface LoaderProps {
  message: string;
  size: 'small' | 'medium' | 'large';
}

export function Loader({ message, size }: LoaderProps) {
  const [sizeValue, setSizeValue] = React.useState<number>(60);
  const [direction, setDirection] = React.useState<'row' | 'column'>('column');

  React.useEffect(() => {
    switch (size) {
      case 'small':
        setSizeValue(28);
        break;
      case 'medium':
        setSizeValue(60);
        break;
      case 'large':
        setSizeValue(90);
        break;
      default:
        setSizeValue(60);
    }

    // set direction
    if (size === 'small') setDirection('row');
  }, [size]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: direction,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: 60,
      gap: 2,
      mt: 2
    }}>
      <CircularProgress size={sizeValue}/>
      <Typography variant="body1">
        {message}
        </Typography>
    </Box>
  );
}
