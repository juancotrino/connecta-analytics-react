import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FileArrowUp, PencilLine } from "@phosphor-icons/react";
import { usePopover } from "@/hooks/use-popover";
import { FileUploaderModal } from "./FileUploaderModal";
import { StudyTableData } from "@/types/study";
import { Stack } from "@mui/material";


export function StudyActionButtons({ study }: { study: StudyTableData }) {
  const uploadModal = usePopover();

  return (
    <>
      <Stack direction="row">
        <Tooltip title="Edit Study" arrow>
          <IconButton aria-label="edit" color="primary" >
            <PencilLine weight="fill" />
          </IconButton>
        </Tooltip>

        {study.status !== "Propuesta" && (
          <Tooltip title="Upload File" arrow>
            <IconButton aria-label="upload"
              color="primary" onClick={uploadModal.handleOpen}>
              <FileArrowUp weight="fill" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* Upload File Modal */}
      <FileUploaderModal open={uploadModal.open}
        onClose={uploadModal.handleClose} studyName={study.study_name}
        studyId={study.study_id} country={study.country} />
    </>
  );
}
