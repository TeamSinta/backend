import { instance } from "@/utils/axiosService/customAxios";
import { IInterviewDetailStaging } from "./inverviewDetailInterface";
import { interviewDetail } from "@/mocks/mockDatas";

export const getInterviewDetail = () => {
  return new Promise<{ data: IInterviewDetailStaging }>((resolve) =>
    setTimeout(() => resolve({ data: interviewDetail }), 500)
  );
};
