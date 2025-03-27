import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Checkbox } from "@mui/material";
import { Stack } from "@mui/system";
import { formatString } from "@/methods/string.methods";

export interface StudiesTableFilterProps {
  multiSelectFilters: {
    status: string[];
    country: string[];
    client: string[];
    methodology: string[];
    study_type: string[];
  };
  setMultiSelectFilters: React.Dispatch<
    React.SetStateAction<{
      status: string[];
      country: string[];
      client: string[];
      methodology: string[];
      study_type: string[];
    }>
  >;
  studyIdFilter: number | null;
  setStudyIdFilter: React.Dispatch<React.SetStateAction<number | null>>;
  filterOptions: { [key: string]: string[] };
}

export const StudiesTableFilter: React.FC<StudiesTableFilterProps> = ({
  multiSelectFilters,
  setMultiSelectFilters,
  studyIdFilter,
  setStudyIdFilter,
  filterOptions,
}) => {
  const [localStudyId, setLocalStudyId] = useState<string>(studyIdFilter?.toString() || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStudyIdFilter(localStudyId ? parseInt(localStudyId, 10) : null);
    }, 1000); // Wait 1 second before updating the filter

    return () => clearTimeout(timeout); // Clear the timeout if the component unmounts
  }, [localStudyId, setStudyIdFilter]);

  const handleChange = (key: keyof typeof multiSelectFilters) => (event: SelectChangeEvent<string[]>) => {
    setMultiSelectFilters({
      ...multiSelectFilters,
      [key]: event.target.value,
    });
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <TextField
        sx={{ minWidth: 100 }}
        fullWidth
        label="Study ID"
        type="number"
        value={localStudyId}
        onChange={(event) => setLocalStudyId(event.target.value)}
      />

      {Object.keys(multiSelectFilters).map((key) => (
        <FormControl key={key} sx={{ minWidth: 150 }} fullWidth>
          <InputLabel>{formatString(key)}</InputLabel>
          <Select
            multiple
            label={formatString(key)}
            value={multiSelectFilters[key as keyof typeof multiSelectFilters]}
            onChange={handleChange(key as keyof typeof multiSelectFilters)}
            renderValue={(selected) => (selected as string[]).join(", ")}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                  overflow: "auto",
                },
              },
            }}
          >
            {filterOptions[key]?.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  checked={multiSelectFilters[key as keyof typeof multiSelectFilters].indexOf(option) > -1}
                />
                {option}
              </MenuItem>
            )) || <MenuItem disabled>No data available</MenuItem>}
          </Select>
        </FormControl>
      ))}
    </Stack>
  );
};
