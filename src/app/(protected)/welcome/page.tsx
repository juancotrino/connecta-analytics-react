import * as React from "react";
import type { Metadata } from 'next';
import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { colorSchemes } from "@/styles/theme/color-schemes";
import { Logo } from "@/components/core/logo";

export const metadata = {
  title: 'Dashboard | Welcome',
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Card>
      <CardContent sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorSchemes.light.palette.primary[100],
            width: 250,
            height: 250,
            borderRadius: "50%",
          }}>
          <Logo color="light" width={200} />
        </Box>

        <Typography variant="h4"
          sx={{ mt: 3, textAlign: "center" }}
          color={colorSchemes.light.palette.primary[500]} >
          Welcome to Connecta Analytics Interface!
        </Typography>
      </CardContent>
    </Card>
  );
}
