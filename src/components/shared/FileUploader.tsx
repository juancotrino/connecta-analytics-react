import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Trash } from "@phosphor-icons/react";

interface FileUploaderProps {
  onFileUpload: React.Dispatch<React.SetStateAction<File | null>>;
  acceptedTypes: string;
  disabled: boolean;
  selectedFile: File | null;
}

const mimeTypes: Record<string, string[]> = {
  "xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
  // Add other MIME types as needed
};

export function FileUploader(
  { onFileUpload, acceptedTypes, disabled, selectedFile }: FileUploaderProps
) {
  const [error, setError] = useState<string>("");
  const [internalFile, setInternalFile] = useState<File | null>(selectedFile);

  useEffect(() => {
    setInternalFile(selectedFile);
  }, [selectedFile]);

  /**
   * Custom hook to handle file drop and selection.
   * It uses the `react-dropzone` library to manage drag-and-drop file uploads.
   * It accepts a single file and validates its type based on the acceptedTypes prop.
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes ? { [acceptedTypes]: mimeTypes[acceptedTypes] || [] } : {},
    multiple: false,
    disabled,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError("Invalid file type. Please upload a valid file.");
        return;
      }
      setError("");
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
        border: "2px dashed var(--medium-gray-color)",
        padding: 3,
        textAlign: "center",
        borderRadius: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        bgcolor: isDragActive ? "var(--light-gray-color)" : "transparent",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input {...getInputProps()} />
      {internalFile ? (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{
              maxWidth: "80%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
            {isDragActive ? "Drop the file here..." : "Drag & drop a file here or click to select one"}
          </Typography>
          <Button variant="text" disabled={disabled}>
            Select File
          </Button>
        </>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}
