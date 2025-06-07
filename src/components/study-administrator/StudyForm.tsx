'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/providers/AlertProvider';
import { useLoading } from '@/providers/LoadingProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BusinessData } from '@/types/business';
import { Country } from '@/types/country';
import { NewStudy, StudyToEdit } from '@/types/study';
import { getBusinessData } from '@/lib/businessService';
import { createStudy, editStudy } from '@/lib/studiesService';
import { BackButton } from '@/components/shared/BackButton';
import { AddCountryButton } from '@/components/study-administrator/AddCountryButton';
import { AddedStudyCountries } from '@/components/study-administrator/AddedStudyCountries';
import CountryForm from '@/components/study-administrator/CountryForm';

const schema = z.object({
  study_name: z.string().min(1, 'Study Name is required').min(4, 'Study Name must be at least 4 characters'),
  client: z.string().min(1, 'Client is required'),
});

type FormValues = z.infer<typeof schema>;

export default function StudyForm({ studyToEdit }: { studyToEdit?: StudyToEdit }) {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  const countryFormRef = React.useRef<HTMLDivElement | null>(null);

  const [businessData, setBusinessData] = React.useState<BusinessData>({
    clients: [],
    currencies: [],
    methodologies: [],
    sharepoint_folder_structure: [],
    statuses: [],
    study_types: [],
    consultants: [],
    countries: [],
  });
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [addCountry, setAddCountry] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [countryToEdit, setCountryToEdit] = React.useState<{ country: Country; index: number } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      study_name: '',
      client: '',
    },
    mode: 'onChange',
  });

  const fetchBusinessData = async () => {
    showLoading();
    await getBusinessData()
      .then((data: BusinessData) => {
        setBusinessData(data);
        hideLoading();
      })
      .catch((error) => {
        hideLoading();
        showAlert({
          message: 'Error fetching business data',
          severity: 'error',
          error,
        });
      });
  };

  const onSubmit = (data: FormValues) => {
    if (!countries.length) {
      showAlert({
        message: 'Please add at least one country to the study.',
        severity: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    if (studyToEdit) updateStudy(data);
    else createNewStudy(data);
  };

  const createNewStudy = (data: FormValues) => {
    const studyData: NewStudy = { ...data, countries };

    createStudy(studyData)
      .then(() => {
        showAlert({
          message: 'Study created successfully',
          severity: 'success',
        });
        setIsSubmitting(false);
        // navigate to studies table
        router.push('/study-administrator');
      })
      .catch((error) => {
        setIsSubmitting(false);
        showAlert({
          message: 'Error creating study',
          severity: 'error',
          error,
        });
      });
  };

  const updateStudy = (data: FormValues) => {
    if (!studyToEdit) return;

    const studyData: StudyToEdit = {
      ...data,
      study_id: studyToEdit.study_id,
      source: studyToEdit.source,
      countries: countries.map(
        (country): Country => ({
          ...country,
          consultant: country.consultant || null,
          status: country.status,
          creation_date: country.creation_date || null,
          last_update_date: country.last_update_date || null,
        })
      ),
    };

    editStudy(studyData)
      .then(() => {
        showAlert({
          message: 'Study updated successfully',
          severity: 'success',
        });
        setIsSubmitting(false);
        // navigate to studies table
        router.push('/study-administrator');
      })
      .catch((error) => {
        setIsSubmitting(false);
        showAlert({
          message: 'Error updating study',
          severity: 'error',
          error,
        });
      });
  };

  // Scroll to the country form when it is opened
  const scrollToCountryForm = () => {
    setTimeout(() => {
      const element = countryFormRef.current;
      if (element) {
        const offset = 80; // Navbar blank space
        const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  React.useEffect(() => {
    fetchBusinessData();
    if (studyToEdit) {
      reset({
        study_name: studyToEdit.study_name,
        client: studyToEdit.client,
      });
      setCountries(studyToEdit.countries);
    }
  }, [reset, studyToEdit]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <BackButton />
        <Typography variant="h4">{studyToEdit ? 'Edit Study' : 'New Study'}</Typography>
      </Stack>

      <Card>
        <CardContent>
          <form>
            <Grid container spacing={2} sx={{ mt: 0.1 }}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth error={!!errors.study_name}>
                  <Controller
                    name="study_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Name"
                        variant="outlined"
                        error={!!errors.study_name}
                        disabled={!!studyToEdit}
                      />
                    )}
                  />
                  <FormHelperText>{errors.study_name?.message}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth error={!!errors.client}>
                  <InputLabel>Client</InputLabel>
                  <Controller
                    name="client"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Client"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                              overflow: 'auto',
                            },
                          },
                        }}
                      >
                        {businessData.clients.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    disabled={!!studyToEdit}
                  />
                  <FormHelperText>{errors.client?.message}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </form>

          <AddedStudyCountries
            countries={countries}
            setCountries={setCountries}
            setCountryToEdit={setCountryToEdit}
            setShowCountryForm={setAddCountry}
            scrollToForm={scrollToCountryForm}
          />

          {!addCountry && (
            <AddCountryButton
              setAddCountry={setAddCountry}
              countriesCount={countries.length}
              setCountryToEdit={setCountryToEdit}
              scrollToForm={scrollToCountryForm}
            />
          )}

          {addCountry && (
            <div ref={countryFormRef}>
              <CountryForm
                businessData={businessData}
                setShowCountryForm={setAddCountry}
                countries={countries}
                setCountries={setCountries}
                countryToEdit={countryToEdit}
              />
            </div>
          )}
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => router.push('/study-administrator')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
          >
            {isSubmitting ? 'Saving...' : 'Save Study'}
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}
