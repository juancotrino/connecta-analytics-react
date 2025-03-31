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
import { StudyTableData } from "@/types/study";
import moment from "moment";
import { Loader } from "@/components/shared/Loader";
import { ChipsList } from "./ChipsList";
import { StudyActionButtons } from "./StudyActionButtons";

interface StudiesTableProps {
  loading: boolean;
  studies: StudyTableData[];
  totalStudies: number;
  page: number;
  rowsPerPage: number;
  cellHeaders: string[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StudiesTable({
  loading,
  studies,
  totalStudies,
  page,
  rowsPerPage,
  cellHeaders,
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
      <TableContainer sx={{ maxHeight: "calc(100vh - 390px)" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell sx={{ minWidth: 128 }}>Name</TableCell>
              <TableCell sx={{ minWidth: 128 }}>Client</TableCell>
              <TableCell sx={{ minWidth: 128 }}>Creation Date</TableCell>
              <TableCell sx={{ minWidth: 128 }}>Last Update</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell sx={{ minWidth: 92 }}>Country</TableCell>
              <TableCell sx={{ minWidth: 108 }}>Status</TableCell>
              <TableCell>Methodology</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell sx={{ minWidth: 136 }}>Consultant</TableCell>
              <TableCell sx={{ minWidth: 260 }}>Description</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Show Loader when loading */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Loader message="Loading studies..." size="small" />
                </TableCell>
              </TableRow>
            ) : (
              studies.map((study, rowIndex) => {
                const studyIdStr = study.study_id.toString();
                const isFirstRow = !renderedStudies.has(studyIdStr);

                // Increment render count for study_id
                renderedStudies.set(studyIdStr, (renderedStudies.get(studyIdStr) || 0) + 1);

                return (
                  <TableRow key={rowIndex}>
                    {isFirstRow && (
                      <>
                        <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                          {study.study_id}
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

                    {/* Columns for the current row */}
                    <TableCell>
                      <StudyActionButtons study={study} />
                    </TableCell>
                    <TableCell>{study.country}</TableCell>
                    <TableCell>{study.status}</TableCell>
                    <TableCell>
                      <ChipsList options={study.methodology} />
                      </TableCell>
                    <TableCell>
                      <ChipsList options={study.study_type} />
                    </TableCell>
                    <TableCell>{study.value}</TableCell>
                    <TableCell>{study.currency}</TableCell>
                    <TableCell>{study.consultant}</TableCell>
                    <TableCell>{study.description}</TableCell>
                  </TableRow>
                );
              })
            )}
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
