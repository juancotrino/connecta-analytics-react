import { StudiesData, NewStudy, StudyToEdit } from "../types/study";
import axios from "axios";
import qs from "qs";
import { getAuthHeaders } from "@/utils/authHeaders";
import { NewStudyFile } from "@/types/file";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}studies`;

export const fetchStudies = async (filters: {
  limit: number;
  offset: number;
  study_id: number | null;
  status: string[];
  country: string[];
  client: string[];
  methodology: string[];
  study_type: string[];
}): Promise<StudiesData> => {
  try {
    const response = await axios.get(`${API_URL}/query`, {
      ...getAuthHeaders(),
      params: {
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        ...(filters.study_id ? { study_id: filters.study_id } : {}),
        ...(filters.status.length ? { status: filters.status } : {}),
        ...(filters.country.length ? { country: filters.country } : {}),
        ...(filters.client.length ? { client: filters.client } : {}),
        ...(filters.methodology.length ? { methodology: filters.methodology } : {}),
        ...(filters.study_type.length ? { study_type: filters.study_type } : {}),
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createStudy = async (studyData: NewStudy) => {
  try {
    const response = await axios.post(
      `${API_URL}/create`, studyData, getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadStudyFile = async (
  fileData: NewStudyFile
): Promise<{message: string; file_folder: string}> => {
  try {
    const formData = new FormData();
    formData.append("file", fileData.file);

    const response = await axios.post(
      `${API_URL}/upload_file/${fileData.study_id}`,
      formData,
      {
        ...getAuthHeaders("multipart/form-data"),
        params: {
          country: fileData.country,
          file_name: fileData.file_name,
          study_name: fileData.study_name,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editStudy = async (studyData: StudyToEdit) => {
  try {
    const { study_id } = studyData;

    const response = await axios.patch(
      `${API_URL}/update/${study_id}`, studyData, getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
