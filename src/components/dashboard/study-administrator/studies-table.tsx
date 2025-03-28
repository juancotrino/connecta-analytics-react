import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { StudyActions } from "./studies-table-actions";
import { StudyTableData } from "@/types/study";
import moment from "moment";

interface StudiesTableProps {
  studies: StudyTableData[];
  totalStudies: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StudiesTable({
  studies,
  totalStudies,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: StudiesTableProps) {
  // Count the number of times each `study_id` appears in the list
  const studyCounts = useMemo(() => {
    const counts = new Map<string, number>();
    studies.forEach((study) => {
      const studyIdStr = study.study_id.toString(); // Convert to string to use as key
      counts.set(studyIdStr, (counts.get(studyIdStr) || 0) + 1);
    });
    return counts;
  }, [studies]);

  // Keep track of how many times each `study_id` has been rendered
  const renderedStudies = new Map<string, number>();

  return (
    <>
      <TableContainer sx={{ maxHeight: "calc(100vh - 346px)" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Methodology</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Consultant</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studies.map((study, rowIndex) => {
              const studyIdStr = study.study_id.toString();
              const isFirstRow = !renderedStudies.has(studyIdStr);

              // Increment the count of times this `study_id` has been rendered
              renderedStudies.set(studyIdStr, (renderedStudies.get(studyIdStr) || 0) + 1);

              return (
                <TableRow key={rowIndex}>
                  {isFirstRow && (
                    <>
                      <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                        {study.study_id}
                      </TableCell>
                      <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                        <StudyActions study={study} />
                      </TableCell>
                      <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                        {study.study_name}
                      </TableCell>
                      <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                        {study.client}
                      </TableCell>
                      <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                        {moment(study.creation_date).format("DD/MM/YY HH:mm")}
                      </TableCell>
                      <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                        {moment(study.last_update_date).format("DD/MM/YY HH:mm")}
                      </TableCell>
                    </>
                  )}

                  {/* Render the rest of the columns for the current row */}
                  <TableCell>{study.country}</TableCell>
                  <TableCell>{study.methodology}</TableCell>
                  <TableCell>{study.study_type}</TableCell>
                  <TableCell>{study.value}</TableCell>
                  <TableCell>{study.currency}</TableCell>
                  <TableCell>{study.consultant}</TableCell>
                  <TableCell>{study.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalStudies}
        page={page}
        rowsPerPageOptions={[25, 50, 100]}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
}
