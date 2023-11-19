// import { InterviewDetailResponse } from "./inverviewDetailInterface";
// import { interviewDetail } from "@/mocks/mockDatas";
// export const getInterviewDetail = () => {
//   return new Promise<{ data: IInterviewDetailStaging }>((resolve) =>
//     setTimeout(() => resolve({ data: interviewDetail }), 500)
//   );
// };

import { instance } from "@/utils/axiosService/customAxios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/*  TODO: Update APIS with interface stastify TS */

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
    `${BASE_URL}/templates/${templateId}/templatequestions/`
  );
  return response.data;
};
