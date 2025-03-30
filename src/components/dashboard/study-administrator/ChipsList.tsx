import React from "react";
import { Chip } from "@mui/material";

/**
 * This component is used to display a list of chips in the table
 * It takes an array of strings as a prop and renders each string as a chip
 */
export function ChipsList({options}: { options: string[] | null }) {
  return (
    <>
    { options ? options.map((opt, index) => (
      <Chip sx={{ margin: "0 2px 2px" }}
        key={index}
        label={opt}
        size="small"
        color="primary"
        variant="outlined"
      />
    )) : ""}
    </>
  );
}
