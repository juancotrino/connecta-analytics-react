import axios from "axios";
import { BusinessData } from "@/types/business";
import { getAuthHeaders } from "@/utils/authHeaders";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}business`;
// Store business data session cache
let businessDataCache: BusinessData | null = null;
// Store allowed files session cache
let allowedFilesCache: any | null = null;

export const cleanCache = () => {
  businessDataCache = null;
  allowedFilesCache = null;
}

/**
 * Fetches business data from the API
 * @returns {Promise<BusinessData>} Business data
 */
const fetchBusinessDataFromDB = async (): Promise<BusinessData> => {
  try {
    const response = await axios.get(
      `${API_URL}/get_business_data`, getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get cached business data or fetches it from the API
 * @returns {Promise<BusinessData>} Business data
 */
export const getBusinessData = async (): Promise<BusinessData> => {
  if (businessDataCache) return businessDataCache;

  const data: BusinessData = await fetchBusinessDataFromDB();
  businessDataCache = data;
  return data;
}

// Fetches allowed files to upload from the API
const fetchAllowedFilesFromDB = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/get_allowed_files`, getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get cached allowed files or fetches it from the API
export const getAllowedFiles = async () => {
  if (allowedFilesCache) return allowedFilesCache;

  const data: any = await fetchAllowedFilesFromDB();
  allowedFilesCache = data;
  return data;
}
