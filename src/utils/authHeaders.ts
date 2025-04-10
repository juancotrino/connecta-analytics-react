/**
 * Utility function to get authorization headers for API requests
 * @returns {Object} Headers object containing the Authorization
 * and Content-Type headers
 */
export const getAuthHeaders = (contentType: string = 'application/json'): object => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType,
    },
  };
};
