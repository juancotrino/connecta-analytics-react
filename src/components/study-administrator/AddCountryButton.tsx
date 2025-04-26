import React from "react";
import Tooltip from '@mui/material/Tooltip';
import { Button, Stack } from "@mui/material";
import { WarningCircle } from "@phosphor-icons/react";
import { Country } from "@/types/country";

type AddCountryButtonProps = {
  countriesCount: number;
  setAddCountry: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryToEdit: React.Dispatch<React.SetStateAction<{country: Country, index: number} | null>>;
  scrollToForm: () => void;
};

export function AddCountryButton({
  countriesCount, setAddCountry, setCountryToEdit, scrollToForm
}: AddCountryButtonProps) {
  // Actions to be performed when the button is clicked
  const buttonClickHandler = () => {
    setAddCountry(true);
    setCountryToEdit(null);
    scrollToForm();
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="contained" size="small"
        onClick={buttonClickHandler} color="secondary">
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
