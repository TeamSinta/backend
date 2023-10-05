import axios from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MembersList, UserData } from "./userSettingsInterface";
import { AccessToken, CompanyID } from "./userSettingTypes";

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

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      void,
      { access: AccessToken; userData: UserData }
    >({
      query: ({ access, userData }) => {
        return {
          url: "/user/userdetails/",
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access}`,
          },
          body: userData,
        };
      },
    }),
    deactivateUser: builder.mutation<void, { access: AccessToken }>({
      query: ({ access }) => {
        return {
          url: "/user/delete/",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        };
      },
    }),
    getCompanyMembers: builder.mutation<
      MembersList[],
      { access: AccessToken; company_id: CompanyID }
    >({
      query: ({ access, company_id }) => {
        return {
          url: `/user/company/${company_id}/members`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        };
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useGetCompanyMembersMutation,
} = userAPI;
