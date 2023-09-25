// eslint-disable-next-line @typescript-eslint/no-redeclare
import { instance } from "@/utils/axiosService/customAxios";

export const getTemplates = async () => {
  return await instance
    .get("/templates")
    .then((result) => {
      return result.data;
    })
    .catch((e) => {
      console.log(e);
    });
};
