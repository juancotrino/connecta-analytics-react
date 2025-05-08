import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FileArrowUp } from "@phosphor-icons/react";
import { usePopover } from "@/hooks/use-popover";
import { FileUploaderModal } from "./FileUploaderModal";
import { StudyTableData } from "@/types/study";
import { StudyFileConfig } from "@/types/file";
import { Box } from "@mui/system";


export function UploadFileButton(
  { study, fileTypes }: { study: StudyTableData, fileTypes: { [key: string]: StudyFileConfig } }
) {
  const uploadModal = usePopover();
  const getFileName = () => {
    if (study.status !== "Propuesta") return null;
    return "proposal";
  };

  const isDisabled = () => {
    if (!fileTypes || Object.keys(fileTypes).length === 0) return true;
    // If status is "Propuesta" and fileTypes obj does not contain "proposal"
    if (study.status === "Propuesta" && !fileTypes["proposal"]) return true;
    return false;

  }

  return (
    <>
      <Tooltip title={isDisabled() ? "Not available" : "Upload File"} arrow>
        <Box>
          <IconButton aria-label="upload"
            sx={{ padding: 0 }}
            disabled={isDisabled()}
            color="primary" onClick={uploadModal.handleOpen}>
            <FileArrowUp weight="fill" />
          </IconButton>
        </Box>
      </Tooltip>

      {/* Upload File Modal */}
      <FileUploaderModal
        fileTypes={fileTypes}
        open={uploadModal.open}
        onClose={uploadModal.handleClose}
        studyName={study.study_name}
        studyId={study.study_id}
        country={study.country}
        defaultFileName={getFileName()} />
    </>
  );
}
