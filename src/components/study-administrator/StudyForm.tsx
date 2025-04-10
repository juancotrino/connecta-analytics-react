"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button, Card, CardActions, CardContent, Divider,
  FormControl, FormHelperText, Grid, InputLabel, MenuItem,
  Select, Stack, TextField, Typography, CircularProgress
} from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BusinessData } from "@/types/business";
import { getBusinessData } from "@/lib/businessService";
import CountryForm from "@/components/study-administrator/CountryForm";
import { Country } from "@/types/country";
import { NewStudy } from "@/types/study";
import { AddedStudyCountries } from "@/components/study-administrator/AddedStudyCountries";
import { createStudy } from "@/lib/studiesService";
import { useRouter } from "next/navigation";
import { AddCountryButton } from "@/components/study-administrator/AddCountryButton";
import { useAlert } from "@/providers/AlertProvider";
import { useLoading } from "@/providers/LoadingProvider";
import { BackButton } from "@/components/shared/BackButton";


const schema = z.object({
  study_name: z.string().min(1, "Study Name is required")
    .min(4, "Study Name must be at least 4 characters"),
  client: z.string().min(1, "Client is required")
});

type FormValues = z.infer<typeof schema>;

export default function StudyForm() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();
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
  const [addCountry, setAddCountry] = React.useState<boolean>(false);
  const [creatingStudy, setCreatingStudy] = React.useState<boolean>(false);

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
    showLoading();
    await getBusinessData().then((data: BusinessData) => {
      setBusinessData(data);
      hideLoading();
    }).catch((error) => {
      hideLoading();
      const errorMsg = error.message || "Error fetching business data";
      showAlert(errorMsg, "error");
    });
  };

  const onSubmit = (data: FormValues) => {
    if (!countries.length) return;

    setCreatingStudy(true);
    const studyData: NewStudy = {...data, countries};
    createStudy(studyData).then(() => {
      showAlert("Study created successfully", "success");
      setCreatingStudy(false);
      // navigate to studies table
      router.push("/study-administrator");
    }).catch((error) => {
      setCreatingStudy(false);
      const errorMsg = error.message || "Error creating study";
      showAlert(errorMsg, "error");
    });
  };

  React.useEffect(() => {
    fetchBusinessData();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <BackButton />
        <Typography variant="h4">{studyId ? "Edit Study" : "New Study"}</Typography>
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

          <AddedStudyCountries countries={countries} setCountries={setCountries} />

          {!addCountry && (
            <AddCountryButton setAddCountry={setAddCountry} countriesCount={countries.length} />
          )}

          {addCountry && (
            <CountryForm
              businessData={businessData} setShowCountryForm={setAddCountry}
              countries={countries} setCountries={setCountries} />
          )}
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => router.push("/study-administrator")}
            disabled={creatingStudy} >
            Cancel
          </Button>
          <Button variant="contained" color="primary"
            onClick={handleSubmit(onSubmit)} disabled={creatingStudy}
            startIcon={creatingStudy ? <CircularProgress size={16} />
              : undefined}
          >
            {creatingStudy ? "Creating..." : "Create Study"}
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}
