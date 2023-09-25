import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Function to fetch company users
export const fetchCompanyUsers = async (companyId: number) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/user/company-users/?company_id=${companyId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
