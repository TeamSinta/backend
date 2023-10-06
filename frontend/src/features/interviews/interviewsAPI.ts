// eslint-disable-next-line @typescript-eslint/no-redeclare
import { instance } from "@/utils/axiosService/customAxios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getQuestionsBank = async () => {
  return await instance
    .get(`${BASE_URL}/question/question-banks/`)
    .then((result) => {
      return result.data;
    })
    .catch((e) => {});
};
