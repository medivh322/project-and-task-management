import * as authTypes from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { commonApi, commonReducerAction } from "../common/reducer";

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
  endpoints: (builder) => ({
    sign: builder.mutation<
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
          dispatch(commonApi.util.invalidateTags(["Sign"]));
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: false }));
      },
    }),
  }),
});

export const { useSignMutation } = loggenApi;

export default loggenApi;
