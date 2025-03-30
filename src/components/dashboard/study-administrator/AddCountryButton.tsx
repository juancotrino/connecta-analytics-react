import React from "react";
import Tooltip from '@mui/material/Tooltip';
import { Button, Stack } from "@mui/material";
import { WarningCircle } from "@phosphor-icons/react";

type AddCountryButtonProps = {
  countriesCount: number;
  setAddCountry: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AddCountryButton({countriesCount, setAddCountry }: AddCountryButtonProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="contained" size="small" onClick={() => setAddCountry(true)}>
        Add Country
      </Button>
      {countriesCount === 0 && (
        <Tooltip arrow color="var(--danger-color)"
          title="At least one country is required" >
          <WarningCircle size={20} weight="fill" />
        </Tooltip>
      )}
    </Stack>
  );
}
