import React from "react";
import {IconButton, List, ListItem, ListItemText, Tooltip, Typography} from "@mui/material";
import { Country } from "@/types/country";
import {PencilLine, Trash } from "@phosphor-icons/react";
import { Stack } from "@mui/system";

interface AddedStudyCountriesProps {
  countries: Country[];
  setCountries: React.Dispatch<React.SetStateAction<Country[]>>;
  setCountryToEdit: React.Dispatch<React.SetStateAction<{country: Country, index: number} | null>>;
  setShowCountryForm: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToForm: () => void;
}

export function AddedStudyCountries({
  countries, setCountries, setCountryToEdit, setShowCountryForm, scrollToForm
}: AddedStudyCountriesProps) {
  // Delete country from the list
  const deleteCountry = (index: number) => {
    const newCountries = [...countries];
    newCountries.splice(index, 1);
    setCountries(newCountries);
  }

  // Set country to edit and show the form
  const editCountry = (country: Country, index: number) => {
    setCountryToEdit({country, index});
    setShowCountryForm(true);
    scrollToForm();
  }

  return (
    <List>
      {countries.map((country, index) => (
        <ListItem key={index}>
          <Stack key={index} direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={0.5} sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Edit" arrow>
              <IconButton aria-label="edit" color="primary" sx={{ p: 0 }}
                onClick={() => editCountry(country, index)}>
                <PencilLine weight="fill" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" arrow>
              <IconButton aria-label="delete" color="primary" sx={{ p: 0 }}
                onClick={() => deleteCountry(index)}>
                <Trash weight="fill" />
              </IconButton>
            </Tooltip>
            </Stack>

            <ListItemText primary={country.country}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    Consultant: {country.consultant || 'N/A'}
                  </Typography>
                  {
                  ` | Currency: ${country.currency || 'N/A'}
                    | Value:${country.value || 'N/A'}
                    | Types: ${country.study_type?.length ? country.study_type : 'N/A' }
                    | Methodologies: ${country.methodology?.length ? country.methodology : 'N/A'}`
                  }
                </React.Fragment>
              }
            />
        </Stack>
        </ListItem>
      ))}
    </List>
  );
}
