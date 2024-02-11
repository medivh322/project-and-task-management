import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { COMMON_REDUCER, LOADING_FULLSCREEN, SET_ID } from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import errorHandler, { ErrorRes } from "../../request/errorHundler";

interface ICommonState {
  isLoadingFullScreen: boolean;
  userId: string | null;
}

const initialState: ICommonState = {
  isLoadingFullScreen: false,
  userId: null,
};

const commonSlice = createSlice({
  name: COMMON_REDUCER,
  initialState,
  reducers: {
    [LOADING_FULLSCREEN]: (
      state,
      action: PayloadAction<{
        loading: boolean;
      }>
    ) => {
      state.isLoadingFullScreen = action.payload.loading;
    },
    [SET_ID]: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      state.userId = action.payload.id;
    },
  },
});

export const commonApi = createApi({
  reducerPath: "common",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Sign"],
  endpoints: (builder) => ({
    checkAccessRole: builder.query<
      void,
      {
        projectId: string | undefined;
        accessRole: string;
      }
    >({
      query: ({ projectId, accessRole }) => ({
        url: `role`,
        body: {
          projectId,
          accessRole,
        },
        method: "POST",
      }),
    }),
    checkToken: builder.query<{ id: string }, null>({
      query: () => ({
        url: "auth",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(commonSlice.actions[SET_ID]({ id: data.id }));
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
      providesTags: ["Sign"],
    }),
  }),
});

export const { useCheckAccessRoleQuery, useCheckTokenQuery } = commonApi;
export const commonReducerState = commonSlice.getInitialState;
export const commonReducerAction = commonSlice.actions;
export default commonSlice;
