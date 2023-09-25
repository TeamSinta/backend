import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchInterviewRounds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/templates/`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching interview rounds:", error);
    throw error; // Handle the error as needed
  }
};
