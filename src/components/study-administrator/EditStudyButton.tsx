import React from "react";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PencilLine } from "@phosphor-icons/react";
import { StudyTableData } from "@/types/study";
import { useRouter } from "next/navigation";

interface EditStudyButtonProps {
  studies: StudyTableData[];
  studyId: number; // Id of the study to be edited
}

export function EditStudyButton({ studies, studyId }: EditStudyButtonProps) {
  const router = useRouter();

  // Function to format study information and navigate to the edit page
  const formatStudyInfo = ()=> {
    const filteredStudies = studies.filter(
      (study) => study.study_id === studyId
    );

    const studyToEdit = {
      study_id: filteredStudies[0].study_id,
      study_name: filteredStudies[0].study_name,
      client: filteredStudies[0].client,
      source: filteredStudies[0].source,
      countries: filteredStudies.map((study) => ({
        country: study.country,
        currency: study.currency,
        methodology: study.methodology,
        status: study.status,
        study_type: study.study_type,
        consultant: study.consultant,
        value: study.value,
        creation_date: study.creation_date,
        last_update_date: study.last_update_date,
        description: study.description,
        number_of_routes: study.number_of_routes,
        number_of_visits: study.number_of_visits,
        number_of_surveys: study.number_of_surveys
      })),
    }
    // Save the study to edit in local storage
    localStorage.setItem("studyToEdit", JSON.stringify(studyToEdit));

    // Navigate to the edit page with the study information
    router.push(`/study-administrator/study-form/${studyId}`);
  }

  return (
    <Tooltip title="Edit Study" arrow>
      <IconButton aria-label="edit" color="primary"
        onClick={formatStudyInfo} >
        <PencilLine weight="fill" />
      </IconButton>
    </Tooltip>
  );
}
