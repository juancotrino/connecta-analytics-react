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
import { UploadFileButton } from "./UploadFileButton";
import { EditStudyButton } from "./EditStudyButton";
import { formatNumber } from "@/utils/formatData";

interface StudiesTableProps {
  loading: boolean;
  studies: StudyTableData[];
  totalStudies: number;
  page: number;
  rowsPerPage: number;
  tableHeaders: string[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StudiesTable({
  loading,
  studies,
  totalStudies,
  page,
  rowsPerPage,
  tableHeaders,
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

  const userHasAccess = (column: string) => {
    if (tableHeaders.includes(column)) {
      return true;
    }
    return false;
  }

  // Keep track of how many times each `study_id` has been rendered
  const renderedStudies = new Map<string, number>();

  return (
    <>
      <TableContainer sx={{ maxHeight: "calc(100vh - 372px)" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {userHasAccess('study_id') && <TableCell>ID</TableCell>}
              {userHasAccess('study_name') &&
                <TableCell sx={{ minWidth: 128 }}>Name</TableCell>}
              {userHasAccess('client') &&
                <TableCell sx={{ minWidth: 128 }}>Client</TableCell>}
              <TableCell colSpan={2} sx={{textAlign: "center"}}>Actions</TableCell>
              {userHasAccess('country') &&
                <TableCell sx={{ minWidth: 92 }}>Country</TableCell>}
              {userHasAccess('status') &&
                <TableCell sx={{ minWidth: 108 }}>Status</TableCell>}
              {userHasAccess('methodology') && <TableCell>Methodology</TableCell>}
              {userHasAccess('study_type') && <TableCell>Type</TableCell>}
              {userHasAccess('value') && <TableCell>Value</TableCell>}
              {userHasAccess('currency') && <TableCell>Currency</TableCell>}
              {userHasAccess('consultant') &&
                <TableCell sx={{ minWidth: 136 }}>Consultant</TableCell>}
              {userHasAccess('description') &&
                <TableCell sx={{ minWidth: 260 }}>Description</TableCell>}
              {userHasAccess('creation_date') &&
                <TableCell sx={{ minWidth: 128 }}>Creation Date</TableCell>}
              {userHasAccess('last_update_date') &&
                <TableCell sx={{ minWidth: 128 }}>Last Update</TableCell>}
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
                        {userHasAccess('study_id') &&
                          <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                            {study.study_id}
                          </TableCell>}
                        {userHasAccess('study_name') &&
                          <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                            {study.study_name}
                          </TableCell>}
                        {userHasAccess('client') &&
                          <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                            {study.client}
                          </TableCell>}
                        <TableCell rowSpan={studyCounts.get(studyIdStr) ?? 1}>
                          <EditStudyButton studies={studies} studyId={study.study_id} />
                        </TableCell>
                      </>
                    )}

                    {/* Columns for the current row */}
                    <TableCell>
                      <UploadFileButton study={study} />
                    </TableCell>
                    {userHasAccess('country') && <TableCell>{study.country}</TableCell>}
                    {userHasAccess('status') && <TableCell>{study.status}</TableCell>}
                    {userHasAccess('methodology') &&
                      <TableCell>
                        <ChipsList options={study.methodology} />
                      </TableCell>}
                    {userHasAccess('study_type') &&
                      <TableCell>
                        <ChipsList options={study.study_type} />
                      </TableCell>}
                    {userHasAccess('value') &&
                      <TableCell>{formatNumber(study.value)}</TableCell>}
                    {userHasAccess('currency') && <TableCell>{study.currency}</TableCell>}
                    {userHasAccess('consultant') && <TableCell>{study.consultant}</TableCell>}
                    {userHasAccess('description') && <TableCell>{study.description}</TableCell>}
                    {userHasAccess('creation_date') &&
                      <TableCell>
                        {moment(study.creation_date).format("DD/MM/YY HH:mm")}
                      </TableCell>}
                    {userHasAccess('last_update_date') &&
                      <TableCell>
                        {moment(study.last_update_date).format("DD/MM/YY HH:mm")}
                      </TableCell>}
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
