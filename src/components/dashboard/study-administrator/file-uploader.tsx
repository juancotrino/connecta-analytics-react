import React, { useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select,
  MenuItem, FormHelperText
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stack } from "@mui/system";

interface StudyFormProps {
  open: boolean;
  onClose: () => void;
  studyId: number;
}

// Esquema de validación con zod
const schema = z.object({
  country: z.string().min(1, "Country is required"),
  file_to_upload: z.string().min(1, "File is required"),
});

type FormValues = z.infer<typeof schema>;

const options = [] as const; //TODO: mock data delete this line after fetching data

export function FileUploader({ open, onClose, studyId }: StudyFormProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) reset({});
  }, [open, reset]);

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Upload New File</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Country">
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.country?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.file_to_upload}>
              <InputLabel>File to upload</InputLabel>
              <Controller
                name="file_to_upload"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="File to upload">
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.file_to_upload?.message}</FormHelperText>
            </FormControl>
          </Stack>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
