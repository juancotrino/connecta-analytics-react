import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { Trash } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileUpload: React.Dispatch<React.SetStateAction<File | null>>;
  acceptedTypes: string;
  disabled: boolean;
  selectedFile: File | null;
}

const mimeTypes: Record<string, string[]> = {
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  xlsm: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
  ],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  pdf: ['application/pdf'],
};

export function FileUploader({ onFileUpload, acceptedTypes, disabled, selectedFile }: FileUploaderProps) {
  const [error, setError] = useState<string>('');
  const [internalFile, setInternalFile] = useState<File | null>(selectedFile);

  // Convert the acceptedTypes string to an array of types
  const getAcceptedTypesObj = Object.keys(mimeTypes).reduce(
    (acc, key) => {
      if (acceptedTypes.includes(key)) {
        acc[key] = mimeTypes[key];
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  useEffect(() => {
    setInternalFile(selectedFile);
  }, [selectedFile]);

  /**
   * Custom hook to handle file drop and selection.
   * It uses the `react-dropzone` library to manage drag-and-drop file uploads.
   * It accepts a single file and validates its type based on the acceptedTypes prop.
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes ? getAcceptedTypesObj : {},
    multiple: false,
    disabled,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError(`Invalid file type. Accepted types: ${acceptedTypes}`);
        return;
      }
      setError('');
      if (acceptedFiles.length > 0) {
        setInternalFile(acceptedFiles[0]);
        onFileUpload(acceptedFiles[0]);
      }
    },
  });

  const removeFile = () => {
    setInternalFile(null);
    onFileUpload(null);
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed var(--medium-gray-color)',
        padding: 3,
        textAlign: 'center',
        borderRadius: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        bgcolor: isDragActive ? 'var(--light-gray-color)' : 'transparent',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input {...getInputProps()} />
      {internalFile ? (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{
              maxWidth: '80%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {internalFile.name}
          </Typography>
          <IconButton onClick={removeFile} color="error">
            <Trash />
          </IconButton>
        </Box>
      ) : (
        <>
          <Typography>
            {isDragActive ? 'Drop the file here...' : 'Drag & drop a file here or click to select one'}
          </Typography>
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Button variant="text" disabled={disabled}>
              Select File
            </Button>
            {!disabled && (
              <Typography variant="caption" sx={{ width: '100%' }}>
                Accepted file types: {acceptedTypes}
              </Typography>
            )}
          </Stack>
        </>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}
