// import { InterviewDetailResponse } from "./inverviewDetailInterface";
// import { interviewDetail } from "@/mocks/mockDatas";
// import axios from "axios";
import { instance } from "@/utils/axiosService/customAxios";

// export const getInterviewDetail = () => {
//   return new Promise<{ data: IInterviewDetailStaging }>((resolve) =>
//     setTimeout(() => resolve({ data: interviewDetail }), 500)
//   );
// };
const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const getInterviewDetail = async (templateId: string): Promise<InterviewDetailResponse[]> => {
//   try {
//     // Replace 'your_api_endpoint' with the actual URL of your API endpoint.
//     const response = await axios.get(`${BASE_URL}/templates/${templateId}/`);
//     const data: InterviewDetailResponse[] = response.data;
//     await new Promise((resolve) => setTimeout(resolve, 500)); // 1000ms (1 second) delay
//     return data;
//   } catch (error) {
//     console.error('Error fetching interview detail:', error);
//     throw error;
//   }
// };

export const getInterviewTemplate = async (templateId: string) => {
  const response = await instance.get(`${BASE_URL}/templates/${templateId}/`);
  return response.data;
};

export const getInterviewSections = async (templateId: string) => {
  const response = await instance.get(
    `${BASE_URL}/templates/${templateId}/topics/`
  );
  return response.data;
};

export const getInterviewDetail = async (templateId: string) => {
  const response = await instance.get(
    `${BASE_URL}/templates/${templateId}/questions/`
  );
  return response.data;
};
