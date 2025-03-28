"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button, Card, CardActions, CardContent, Divider,
  FormControl, FormHelperText, Grid, InputLabel, MenuItem,
  Select, Stack, TextField, Typography
} from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BusinessData } from "@/types/business";
import { getBusinessData } from "@/lib/business.service";
import CountryForm from "@/components/dashboard/study-administrator/country-form";
import { Country } from "@/types/country";
import { NewStudy } from "@/types/study";
import { AddedStudyCountries } from "@/components/dashboard/study-administrator/added-study-countries";
import { createStudy } from "@/lib/studies.service";
import { useRouter } from "next/navigation";


const schema = z.object({
  study_name: z.string().min(1, "Study Name is required")
    .min(4, "Study Name must be at least 4 characters"),
  client: z.string().min(1, "Client is required")
});

type FormValues = z.infer<typeof schema>;

export default function StudyFormPage() {
  const router = useRouter();
  const params = useParams();
  const studyId = params?.id; // TODO: pending edit study
  const [businessData, setBusinessData] = React.useState<BusinessData>({
    clients: [],
    currencies: [],
    methodologies: [],
    sharepoint_folder_structure: [],
    statuses: [],
    study_types: [],
    supervisors: [],
    countries: []
  });
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [countriesError, setCountriesError] = React.useState(false);

  const {
    control, handleSubmit, formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      study_name: "",
      client: ""
    }, // TODO: pending edit study
  });

  const fetchBusinessData = async () => {
    await getBusinessData().then((data: BusinessData) => {
      setBusinessData(data);
    }).catch((error) => {
      console.error("Error fetching business data:", error
      );
    });
  };

  const onSubmit = (data: FormValues) => {
    if (!countries.length) {
      setCountriesError(true);
      return;
    }

    const studyData: NewStudy = {...data, countries};
    createStudy(studyData).then(() => {
      //TODO: show success message
      // navigate to studies table
      router.push("/dashboard/study-administrator");
    }).catch((error) => {
      console.error("Error creating study:", error);
    });
  };

  React.useEffect(() => {
    fetchBusinessData();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{studyId ? "Edit Study" : "New Study"}</Typography>

      <Card>
        <CardContent>
          <form>
            <Grid container spacing={2} sx={{ mt: 0.1 }}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth error={!!errors.study_name}>
                  <Controller
                    name="study_name"
                    control={control}
                    render={({ field }) =>
                      <TextField {...field} label="Name" variant="outlined" error={!!errors.study_name} />}
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
                      <Select {...field} label="Client"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 250,
                            overflow: "auto",
                          },
                        },
                      }}>
                        {businessData.clients.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.client?.message}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </form>

          <CountryForm
            businessData={businessData} countriesCount={countries.length}
            countriesError={countriesError} setCountriesError={setCountriesError}
            countries={countries} setCountries={setCountries} />

          <AddedStudyCountries countries={countries} setCountries={setCountries} />
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => router.push("/dashboard/study-administrator")}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}
