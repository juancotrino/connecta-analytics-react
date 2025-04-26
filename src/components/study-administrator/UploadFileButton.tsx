import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FileArrowUp } from "@phosphor-icons/react";
import { usePopover } from "@/hooks/use-popover";
import { FileUploaderModal } from "./FileUploaderModal";
import { StudyTableData } from "@/types/study";


export function UploadFileButton({ study }: { study: StudyTableData }) {
  const uploadModal = usePopover();
  const getFileName = () => {
    if (study.status !== "Propuesta") return null;
    return "proposal";
  };

  return (
    <>
      <Tooltip title="Upload File" arrow>
        <IconButton aria-label="upload"
          color="primary" onClick={uploadModal.handleOpen}>
          <FileArrowUp weight="fill" />
        </IconButton>
      </Tooltip>

      {/* Upload File Modal */}
      <FileUploaderModal open={uploadModal.open}
        onClose={uploadModal.handleClose} studyName={study.study_name}
        studyId={study.study_id} country={study.country}
        defaultFileName={getFileName()}/>
    </>
  );
}
