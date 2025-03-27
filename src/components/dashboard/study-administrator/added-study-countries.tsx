import React from "react";
import {IconButton, List, ListItem, ListItemText, Tooltip, Typography} from "@mui/material";
import { Country } from "@/types/country";
import {Trash } from "@phosphor-icons/react";
import { Stack } from "@mui/system";

interface AddedStudyCountriesProps {
  countries: Country[];
  setCountries: ([...countries]: Country[]) => void;
}

export function AddedStudyCountries({ countries, setCountries }: AddedStudyCountriesProps) {
  // Delete country from the list
  const deleteCountry = (index: number) => {
    const newCountries = [...countries];
    newCountries.splice(index, 1);
    setCountries(newCountries);
  }

  return (
    <List>
      {countries.map((country, index) => (
        <ListItem key={index}>
          <Stack key={index} direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Delete Country" arrow>
            <IconButton aria-label="upload" color="primary" sx={{ p: 0 }}
              onClick={() => deleteCountry(index)}>
              <Trash weight="fill" />
            </IconButton>
          </Tooltip>

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
                ` — Currency: ${country.currency || 'N/A'}
                  | Value:${country.value || 'N/A'}
                  | Types: ${country.study_type.length ? country.study_type : 'N/A' }
                  | Methodologies: ${country.methodology.length ? country.methodology : 'N/A'}`
                }
              </React.Fragment>
            }/>
        </Stack>
        </ListItem>
      ))}
    </List>
  );
}
