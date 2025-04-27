import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button, TextField, FormControl, FormHelperText, Grid,
  Select, MenuItem, InputLabel, Typography
} from "@mui/material";
import { BusinessData } from "@/types/business";
import { Country } from "@/types/country";
import { useUser } from "@/hooks/use-user";

// Define the schema for the form
const countrySchema = z.object({
  country: z.string().min(1, "Country is required"),
  consultant: z.string().min(1, "Consultant is required"),
  status: z.string().min(1, "Status is required"),
  methodology: z.array(z.string()),
  study_type: z.array(z.string()),
  value: z.string(),
  currency: z.string(),
  description: z.string(),
  number_of_routes: z.string(),
  number_of_visits: z.string(),
  number_of_surveys: z.string(),
});

type CountryFormProps = {
  businessData: BusinessData;
  setShowCountryForm: React.Dispatch<React.SetStateAction<boolean>>;
  countries: Country[];
  setCountries: React.Dispatch<React.SetStateAction<Country[]>>;
  countryToEdit?: { country: Country; index: number } | null;
};

// Define the FormValues type
type FormValues = z.infer<typeof countrySchema>;

export default function CountryForm({
  businessData, setShowCountryForm, countries, setCountries, countryToEdit
}: CountryFormProps) {
  const { user } = useUser();

  // Set the logged-in user as the default consultant if available
  const defaultConsultant = businessData.consultants.find((consultant) => {
    return consultant.toLowerCase() === user?.name?.toLowerCase();
  });

  const initialValues = {
    country: "",
    methodology: [],
    study_type: [],
    value: "",
    number_of_routes: "",
    number_of_visits: "",
    number_of_surveys: "",
    currency: "",
    consultant: defaultConsultant || "",
    description: "",
    status: "Propuesta" 
  };

  const {
    control, handleSubmit, reset, formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: initialValues,
    mode: "onChange",
  });
  const [countryIndex, setCountryIndex] = React.useState<number>();
  const [isNewCountry, setIsNewCountry] = React.useState<boolean>(true);

  // Handle form submission and add the country to the list
  const onSubmit = async (data: FormValues) => {
    let countryToSubmit: Country = {
      ...data,
      description: data.description || null,
      currency: data.currency || null,
      value: parseFloat(data.value) || null,
      number_of_routes: parseInt(data.number_of_routes) || null,
      number_of_visits: parseInt(data.number_of_visits) || null,
      number_of_surveys: parseInt(data.number_of_surveys) || null,
    };

    if (countryToEdit) {
      const { country, index } = countryToEdit;
      const updatedCountries = [...countries];

      updatedCountries[index] = {
        ...countryToSubmit,
        creation_date: country.creation_date || undefined
      }

      setCountries(updatedCountries);
    } else {
      setCountries([...countries, countryToSubmit]);
    }

    onResetValues();
  };

  // Reset and hide the country form
  const onResetValues = () => {
    setShowCountryForm(false);
    reset(initialValues);
    setCountryIndex(undefined);
    setIsNewCountry(true);
  }

  // Get Form title
  const title = countryToEdit ? `Edit Country No. ${countryIndex as number + 1}` :
    `Add Country No. ${countries.length + 1}`;

  React.useEffect(() => {
    if (countryToEdit) {
      const { country, index } = countryToEdit;
      setIsNewCountry(country?.creation_date === undefined);

      reset({
        country: country.country,
        consultant: country.consultant || "",
        methodology: country.methodology || [],
        study_type: country.study_type || [],
        value: country.value?.toString() || "",
        number_of_routes: country.number_of_routes?.toString() || "",
        number_of_visits: country.number_of_visits?.toString() || "",
        number_of_surveys: country.number_of_surveys?.toString() || "",
        currency: country.currency || "",
        description: country.description || "",
        status: country.status || "Propuesta",
      });
      setCountryIndex(index);
    }
  }, [countryToEdit, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" sx={{ margin: "16px 0"}}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <FormControl fullWidth error={!!errors.country}>
            <InputLabel>Country</InputLabel>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Country"
                  disabled={!!countryToEdit}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflow: "auto",
                      },
                    },
                  }}
                >
                  {businessData.countries.map((option) => (
                    <MenuItem key={option} value={option}
                      disabled={countries.some((c) => c.country === option)} >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.country?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={4} xs={12}>
          <FormControl fullWidth error={!!errors.consultant}>
            <InputLabel>Consultant</InputLabel>
            <Controller
              name="consultant"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Consultant"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflow: "auto",
                      },
                    },
                  }}
                >
                  {businessData.consultants.map((option) => (
                    <MenuItem key={option} value={option} >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.consultant?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={4} xs={12}>
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status"
                  disabled={isNewCountry}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflow: "auto",
                      },
                    },
                  }}
                >
                  {businessData.statuses.map((option) => (
                    <MenuItem key={option} value={option} >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth error={!!errors.study_type}>
            <InputLabel>Study Type</InputLabel>
            <Controller
              name="study_type"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Study Type" multiple
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflow: "auto",
                      }
                    },
                  }}
                >
                  {businessData.study_types.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.study_type?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth error={!!errors.methodology}>
            <InputLabel>Methodology</InputLabel>
            <Controller
              name="methodology"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Methodology" multiple
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflow: "auto",
                      }
                    },
                  }}
                >
                  {businessData.methodologies.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.methodology?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth error={!!errors.value}>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label="Value/price" type="number"
                  inputProps={{ 
                    min: "0.01",
                    step: "0.01"
                  }}
                  variant="outlined" error={!!errors.value} />
              )}
            />
            <FormHelperText>{errors.value?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth error={!!errors.currency}>
            <InputLabel>Currency</InputLabel>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Currency"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflow: "auto",
                      }
                    },
                  }}
                >
                  {businessData.currencies.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.currency?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={4} xs={12}>
          <FormControl fullWidth error={!!errors.number_of_routes}>
            <Controller
              name="number_of_routes"
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label="Number of routes" type="number"
                  inputProps={{ 
                    min: "1",
                    step: "1"
                  }}
                  variant="outlined" error={!!errors.number_of_routes} />
              )}
            />
            <FormHelperText>{errors.number_of_routes?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={4} xs={12}>
          <FormControl fullWidth error={!!errors.number_of_surveys}>
            <Controller
              name="number_of_surveys"
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label="Number of surveys" type="number"
                  inputProps={{ 
                    min: "1",
                    step: "1"
                  }}
                  variant="outlined" error={!!errors.number_of_surveys} />
              )}
            />
            <FormHelperText>{errors.number_of_surveys?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={4} xs={12}>
          <FormControl fullWidth error={!!errors.number_of_visits}>
            <Controller
              name="number_of_visits"
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label="Number of visits" type="number"
                  inputProps={{ 
                    min: "1",
                    step: "1"
                  }}
                  variant="outlined" error={!!errors.number_of_visits} />
              )}
            />
            <FormHelperText>{errors.number_of_visits?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item md={12} xs={12}>
          <FormControl fullWidth error={!!errors.description}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label="Description" multiline rows={3}
                  variant="outlined" error={!!errors.description} />
              )}
            />
            <FormHelperText>{errors.description?.message}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <Button type="button" variant="outlined" size="small"
        sx={{ mt: 2, mr: 1 }} color="error" onClick={() => onResetValues()}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" size="small"
        sx={{ mt: 2 }} color="success" >
        Save Country
      </Button>
    </form>
  );
}
