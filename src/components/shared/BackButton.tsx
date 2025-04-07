import React from "react";
import { Tooltip } from "@mui/material";
import { ArrowCircleLeft } from "@phosphor-icons/react";


export function BackButton() {
  return (
    <Tooltip title="Go Back" arrow >
      <ArrowCircleLeft weight="fill" size={32}
      onClick={() => window.history.back()} />
    </Tooltip>
  );
}
