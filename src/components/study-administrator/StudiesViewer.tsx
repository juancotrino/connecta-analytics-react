"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import { StudiesTableFilter } from "@/components/study-administrator/StudiesTableFilter";
import { StudiesTable } from "@/components/study-administrator/StudiesTable";
import { fetchStudies } from "@/lib/studiesService";
import { StudiesData } from "@/types/study";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider";
import { useLoading } from "@/providers/LoadingProvider";


export default function StudiesViewer(): React.JSX.Element {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  const [multiSelectFilters, setMultiSelectFilters] = React.useState<{
    status: string[];
    country: string[];
    client: string[];
    methodology: string[];
    study_type: string[];
  }>({
    status: [],
    country: [],
    client: [],
    methodology: [],
    study_type: [],
  });
  const [studyIdFilter, setStudyIdFilter] = React.useState<number | null>(null);
  const [data, setData] = React.useState<StudiesData>({ studies: [], total_studies: 0, roles_authorized_columns: [] });
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [tableCols, setTableCols] = React.useState<string[]>([]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = async () => {
    setLoadingData(true);
    await fetchStudies({
      ...multiSelectFilters,
      study_id: studyIdFilter,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((filteredData: StudiesData) => {
      setData(filteredData);
      setTableCols(filteredData.roles_authorized_columns);
      setLoadingData(false);
      hideLoading();
    }).catch((error) => {
      setLoadingData(false);
      hideLoading();
      showAlert({
        message: "Error fetching studies data",
        severity: "error",
        error
      });
    });
  }

  React.useEffect(() => {
    fetchData();
  }, [multiSelectFilters, studyIdFilter, page, rowsPerPage]);

  // Fetch business data on initial render
  React.useEffect(() => {
    showLoading();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4">Studies Viewer</Typography>
        <Button startIcon={<Plus weight="bold" />}
          variant="contained"
          onClick={() => router.push("/study-administrator/study-form")}>
          Create Study
        </Button>
      </Stack>

      <Card>
        <CardContent>
          {tableCols.length > 0 && <>
            <StudiesTableFilter
              multiSelectFilters={multiSelectFilters}
              setMultiSelectFilters={setMultiSelectFilters}
              studyIdFilter={studyIdFilter}
              setStudyIdFilter={setStudyIdFilter}
              tableHeaders={tableCols}/>
            <StudiesTable loading={loadingData}
              studies={data.studies}
              totalStudies={data.total_studies}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              tableHeaders={tableCols} />
          </>}
        </CardContent>
      </Card>
    </Stack>
  );
}
