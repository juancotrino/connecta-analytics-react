import { StudiesData, NewStudy } from "../types/study";
import axios from "axios";
import qs from "qs";

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
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const createStudy = async (studyData: NewStudy) => {
  try {
    const response = await axios.post(`${API_URL}/create`, studyData);
    return response.data;
  } catch (error) {
    console.error("Error creating study:", error);
    throw error;
  }
};
