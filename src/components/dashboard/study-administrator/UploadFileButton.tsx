import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FileArrowUp } from "@phosphor-icons/react";
import { usePopover } from "@/hooks/use-popover";
import { FileUploader } from "./FileUploader";
import { StudyTableData } from "@/types/study";


export function UploadFileButton({ study }: { study: StudyTableData }) {
  const uploadModal = usePopover();

  return (
    <>
      <Tooltip title="Upload File" arrow>
        <IconButton aria-label="upload" color="primary" onClick={uploadModal.handleOpen}>
          <FileArrowUp weight="fill" />
        </IconButton>
      </Tooltip>

      {/* Upload File Modal */}
      <FileUploader open={uploadModal.open}
      onClose={uploadModal.handleClose}
      studyId={study.study_id} />
    </>
  );
}
