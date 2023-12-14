import * as authTypes from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import axios from "axios";
import { kanbanActions, projectsApi } from "../kanban/reducer";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { commonReducerAction } from "../common/reducer";

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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectsApi.util.resetApiState());
        } catch (error: unknown) {}
      },
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: true }));
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: false }));
      },
      invalidatesTags: (result, error, arg) => (error ? [] : ["Auth"]),
    }),
    checkAuthUser: builder.query<any, void>({
      query: () => ({
        url: "auth",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(kanbanActions.SET_ID({ id: data.id }));
        } catch (error: unknown) {}
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
