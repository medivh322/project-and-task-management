import * as authTypes from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import axios from "axios";
import { kanbanActions } from "../kanban/reducer";

type TSignRequest = "login" | "registration";

interface AuthUrls {
  [authTypes.LOGIN]: string;
  [authTypes.SIGNUP]: string;
}

const urls: { [K in keyof AuthUrls]: TSignRequest } = {
  [authTypes.LOGIN]: "login",
  [authTypes.SIGNUP]: "registration",
};

export const loggenApi = createApi({
  reducerPath: "loggen",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    logout: builder.mutation<{ status: string }, void>({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
    }),
    signAction: builder.mutation<
      { error?: string },
      { data: { login: string; password: string }; url: keyof AuthUrls }
    >({
      query: ({ url, data }) => ({
        url: urls[url],
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: (result, error, arg) => (error ? [] : ["Auth"]),
    }),
    checkAuthUser: builder.query<any, void>({
      queryFn: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}auth`, {
            withCredentials: true,
          });
          return { data: response.data };
        } catch (error: any) {
          return { data: error.response.data };
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (!!data.id) dispatch(kanbanActions.SET_ID({ id: data.id }));
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useCheckAuthUserQuery,
  useSignActionMutation,
  useLogoutMutation,
} = loggenApi;

export default loggenApi;
