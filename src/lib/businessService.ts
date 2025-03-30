import axios from "axios";
import { BusinessData } from "@/types/business";
import { getAuthHeaders } from "@/utils/authHeaders";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}business`;
// Store business data session cache
let businessDataCache: BusinessData | null = null;

/**
 * Fetches business data from the API
 * @returns {Promise<BusinessData>} Business data
 */
const fetchBusinessData = async (): Promise<BusinessData> => {
  try {
    const response = await axios.get(
      `${API_URL}/get_business_data`, getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Get cached business data or fetches it from the API
 * @returns {Promise<BusinessData>} Business data
 */
export const getBusinessData = async (): Promise<BusinessData> => {
  if (businessDataCache) {
    return businessDataCache;
  }

  const data: BusinessData = await fetchBusinessData();
  businessDataCache = data;
  return data;
}
