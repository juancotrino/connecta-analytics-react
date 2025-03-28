import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FileArrowUp, PencilLine } from "@phosphor-icons/react";
import { Stack } from "@mui/material";
import { usePopover } from "@/hooks/use-popover";
import { FileUploader } from "./file-uploader";
import { StudyTableData } from "@/types/study";


export function StudyActions({ study }: { study: StudyTableData }) {
  const uploadModal = usePopover();

  return (
    <>
    <Stack direction="row">
      <Tooltip title="Upload File">
        <IconButton aria-label="upload" color="primary" onClick={uploadModal.handleOpen}>
          <FileArrowUp weight="fill" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Study">
        <IconButton aria-label="edit" color="primary" >
          <PencilLine weight="fill" />
        </IconButton>
      </Tooltip>
    </Stack>

    {/* Upload File Modal */}
    <FileUploader open={uploadModal.open} onClose={uploadModal.handleClose} studyId={study.study_id} />
    </>
  );
}
