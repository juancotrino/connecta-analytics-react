"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import { StudiesTableFilter } from "@/components/dashboard/study-administrator/studies-table-filter";
import { StudiesTable } from "@/components/dashboard/study-administrator/studies-table";
import { fetchStudies } from "@/lib/studies.service";
import { StudiesData } from "@/types/study";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { getBusinessData } from "@/lib/business.service";
import { BusinessData } from "@/types/business";
import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function Page(): React.JSX.Element {
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
  const [filterOptions, setFilterOptions] = React.useState<{ [key: string]: string[] }>({});
  const [data, setData] = React.useState<StudiesData>({ studies: [], total_studies: 0 });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = async () => {
    await fetchStudies({
      ...multiSelectFilters,
      study_id: studyIdFilter,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((filteredData: StudiesData) => {
      setData(filteredData);
    }).catch((error) => {
      console.error("Error fetching studies:", error);
    });
  }

  const fetchBusinessData = async () => {
    await getBusinessData().then((data: BusinessData) => {
      setFilterOptions({
        status: data.statuses,
        country: data.countries,
        client: data.clients,
        methodology: data.methodologies,
        study_type: data.study_types,
      });
    }).catch((error) => {
      console.error("Error fetching business data:", error);
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [multiSelectFilters, studyIdFilter, page, rowsPerPage]);

  // Fetch business data on initial render
  React.useEffect(() => {
    fetchBusinessData();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4">Studies Viewer</Typography>
        <Button startIcon={<Plus weight="bold" />}
          variant="contained"
          onClick={() => router.push("/dashboard/study-administrator/study-form")}>
          Create Study
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <StudiesTableFilter
            filterOptions={filterOptions}
            multiSelectFilters={multiSelectFilters}
            setMultiSelectFilters={setMultiSelectFilters}
            studyIdFilter={studyIdFilter}
            setStudyIdFilter={setStudyIdFilter} />
          <StudiesTable
            studies={data.studies}
            totalStudies={data.total_studies}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
