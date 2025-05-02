import React, { useEffect, useState } from 'react';
import { useAlert } from '@/providers/AlertProvider';
import { formatTitle } from '@/utils/formatData';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { NewStudyFile, StudyFileConfig } from '@/types/file';
import { getAllowedFiles } from '@/lib/businessService';
import { uploadStudyFile } from '@/lib/studiesService';
import { FileUploader } from '@/components/shared/FileUploader';

interface StudyFormProps {
  open: boolean;
  onClose: () => void;
  studyId: number;
  studyName: string;
  country: string;
  defaultFileName: string | null;
}

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  file_name: z.string().min(1, 'File type to upload is required'),
});

type FormValues = z.infer<typeof schema>;

export function FileUploaderModal({ open, onClose, studyId, country, studyName, defaultFileName }: StudyFormProps) {
  const { showAlert } = useAlert();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country, file_name: defaultFileName || '' },
    mode: 'onChange',
  });

  const [fileTypes, setFileTypes] = useState<{ [key: string]: StudyFileConfig }>({});
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const fileName = watch('file_name') || '';
  const [acceptedFileTypes, setAcceptedFileTypes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Reset the form values when the modal opens
   * and fetch the allowed files from the API.
   */
  useEffect(() => {
    if (!open) return;

    getAllowedFiles()
      .then(setFileTypes)
      .catch((error) => {
        showAlert({
          severity: 'error',
          message: 'Error fetching allowed files',
          error
        });
      });
  }, [open, reset, country, defaultFileName]);

  /**
   * Update the accepted file types based on the selected file name.
   * Clear the chosen file when the file name changes.
   */
  useEffect(() => {
    if (fileTypes[fileName]) {
      setAcceptedFileTypes(fileTypes[fileName]?.file_type || '');
      setChosenFile(null);
    }
  }, [fileName, fileTypes]);

  // Make request to upload the file
  const uploadFile = (fileData: NewStudyFile) => {
    uploadStudyFile(fileData)
      .then(() => {
        showAlert({
          severity: 'success', message: 'File uploaded successfully',
        });
        onReset();
      })
      .catch((error) => {
        showAlert({
          severity: 'error',
          message: 'Error uploading file',
          error
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = (data: FormValues) => {
    if (!chosenFile) {
      showAlert({
        severity: 'error', message: 'Please select a file to upload',
      });
      return;
    }

    setLoading(true);
    const fileData: NewStudyFile = {
      study_id: studyId,
      country: data.country,
      file_name: data.file_name,
      study_name: studyName,
      file: chosenFile,
    };

    uploadFile(fileData);
  };

  const onReset = () => {
    setChosenFile(null);
    reset({ country, file_name: defaultFileName || '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Upload New File</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ margin: '10px 0 20px' }}>
            <FormControl fullWidth error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Country" disabled>
                    <MenuItem value={country}>{country}</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.country?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.file_name}>
              <InputLabel>File to upload</InputLabel>
              <Controller
                name="file_name"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="File to upload" disabled={defaultFileName !== null}>
                    {Object.keys(fileTypes).map((key) => (
                      <MenuItem key={key} value={key}>
                        {formatTitle(key)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.file_name?.message}</FormHelperText>
            </FormControl>
          </Stack>

          <FileUploader
            acceptedTypes={acceptedFileTypes}
            onFileUpload={setChosenFile}
            disabled={!fileName}
            selectedFile={chosenFile}
          />

          <DialogActions>
            <Button onClick={onReset} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : undefined}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
