import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PencilLine } from "@phosphor-icons/react";
import { StudyTableData } from "@/types/study";


export function EditStudyButton({ study }: { study: StudyTableData }) {
  return (
    <Tooltip title="Edit Study" arrow>
      <IconButton aria-label="edit" color="primary" >
        <PencilLine weight="fill" />
      </IconButton>
    </Tooltip>
  );
}
