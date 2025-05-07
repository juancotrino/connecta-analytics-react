import React, { useEffect, useState } from 'react';
import { formatTitle } from '@/utils/formatData';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { getBusinessData } from '@/lib/businessService';
import { BusinessData } from '@/types/business';
import { useAlert } from '@/providers/AlertProvider';

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
  tableHeaders: string[];
}

export const StudiesTableFilter: React.FC<StudiesTableFilterProps> = ({
  multiSelectFilters,
  setMultiSelectFilters,
  studyIdFilter,
  setStudyIdFilter,
  tableHeaders,
}) => {
  const { showAlert } = useAlert();
  const [localStudyId, setLocalStudyId] = useState<string>(studyIdFilter?.toString() || '');
  const [filterOptions, setFilterOptions] = React.useState<{
      status: string[];
      country: string[];
      client: string[];
      methodology: string[];
      study_type: string[];
    }>({
      status: [],
      country: [],
      client: [],
      methodology: [],
      study_type: [],
    });

  const fetchBusinessData = async () => {
    await getBusinessData().then((data: BusinessData) => {
      setFilterOptions({
        status: data.statuses,
        country: data.countries,
        client: data.clients,
        methodology: data.methodologies,
        study_type: data.study_types,
      });
    }).catch((error) => {
      showAlert({
        message: "Error fetching business data",
        severity: "error",
        error
      });
    });
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

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
    <>
      <Typography variant="h5" component="span">
        Filters
      </Typography>
      <Stack direction="row" spacing={2}
        sx={{
          mb: 1.4,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
        }}
      >
        <TextField
          sx={{ minWidth: 100, mt: 1.5 }}
          fullWidth
          label="Study ID"
          type="number"
          value={localStudyId}
          onChange={(event) => setLocalStudyId(event.target.value)}
        />

        {Object.keys(multiSelectFilters).map((key) => (
          (tableHeaders.includes(key) && (
            <FormControl key={key} sx={{ minWidth: 150, mt:1.5 }} fullWidth>
              <InputLabel>{formatTitle(key)}</InputLabel>
              <Select
                multiple
                label={formatTitle(key)}
                value={multiSelectFilters[key as keyof typeof multiSelectFilters]}
                onChange={handleChange(key as keyof typeof multiSelectFilters)}
                renderValue={(selected) => (selected as string[]).join(', ')}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                      overflow: 'auto',
                    },
                  },
                }}
              >
                  {filterOptions[key as keyof typeof filterOptions]?.map((option: string) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={multiSelectFilters[
                    key as keyof typeof multiSelectFilters
                    ].indexOf(option) > -1} />
                    {option}
                  </MenuItem>
                  )) || <MenuItem disabled>No data available</MenuItem>}
              </Select>
            </FormControl>
          ))
        ))}
      </Stack>
    </>
  );
};
