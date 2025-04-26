"use client";
import StudyForm from '@/components/study-administrator/StudyForm';
import { useParams } from "next/navigation";
import React from 'react';
import { useAlert } from "@/providers/AlertProvider";
import { useRouter } from "next/navigation";
import { StudyToEdit } from '@/types/study';


export default function EditStudy(): React.JSX.Element {
  const { showAlert } = useAlert();
  const router = useRouter();
  // Get the study ID from the URL parameters
  const params = useParams();
  const studyId = params?.id;

  const [studyToEdit, setStudyToEdit] = React.useState<StudyToEdit>();

  // Fetch the study to edit from local storage
  const getStudyData = () => {
    // Check if the study ID is valid
    if (!studyId || isNaN(Number(studyId))) {
      onError("Invalid study ID.");
      return;
    }

    const studyData = localStorage.getItem("studyToEdit");
    if (!studyData) {
      onError("Data not found");
      return;
    }

    const parsedData = JSON.parse(studyData);
    // Check if the study ID matches the one in local storage
    if (parsedData && parsedData.study_id === parseInt(studyId as string)) {
      setStudyToEdit(parsedData);
    } else {
      onError("Data not found.");
    }
  }

  const onError = (errorMsg: string) => {
    showAlert(`Error fetching Study Data: ${errorMsg}`, "error");
    router.push("/study-administrator");
    localStorage.removeItem("studyToEdit");
  }

  React.useEffect(() => {
    getStudyData();
  }, [studyId]);

  return (
    <>
      {studyToEdit && (
        <StudyForm studyToEdit={studyToEdit} />
      )}
    </>
  );
}
