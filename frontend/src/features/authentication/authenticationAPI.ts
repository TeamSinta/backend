import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AccessToken,
  GoogleCode,
  RefreshToken,
  UserReadSerializer,
  Token,
} from "./authenticationInterface";

export const authAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  endpoints: (builder) => ({
    googleLogin: builder.mutation<Token, GoogleCode>({
      query: (code) => ({
        url: import.meta.env.VITE_GOOGLE_OAUTH_CALLBACK_URL,
        method: "POST",
        body: { code: code.code },
        credentials: "include",
      }),
    }),
    getUser: builder.mutation<UserReadSerializer, AccessToken>({
      query: (access) => {
        // console.log("Query: ", access);
        return {
          url: "/user/userdetails/",
          method: "GET",
          headers: {
            Authorization: `Bearer ${access.access}`,
          },
        };
      },
    }),
    validateToken: builder.mutation<void, AccessToken>({
      query: (access) => ({
        url: "/auth/token/verify/",
        method: "POST",
        body: { token: access.access },
      }),
    }),
    getAccessToken: builder.mutation<void, RefreshToken>({
      query: (refresh) => {
        // console.log("Refresh Query: ", refresh);
        return {
          url: "/auth/token/refresh/",
          method: "POST",
          body: { refresh: refresh.refresh },
        };
      },
    }),
  }),
});

export const {
  useGoogleLoginMutation,
  useGetUserMutation,
  useValidateTokenMutation,
  useGetAccessTokenMutation,
} = authAPI;
