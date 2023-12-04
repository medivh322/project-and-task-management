import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as kanbanTypes from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { commonReducerAction } from "../common/reducer";

interface IKanban {
  userId: string | null;
}

const initialState: IKanban = {
  userId: null,
};

const kanbanSlice = createSlice({
  name: kanbanTypes.KANBAN_REDUCER,
  initialState,
  reducers: {
    [kanbanTypes.SET_ID]: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      state.userId = action.payload.id;
    },
  },
});

export const projectsApi = createApi({
  reducerPath: "kanban",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Projects", "Categories"],
  endpoints: (builder) => ({
    addTask: builder.mutation<
      { status: string },
      { categoryId: string | null; name: string }
    >({
      query({ name, categoryId }) {
        return {
          url: "tasks",
          method: "POST",
          body: {
            name,
            categoryId,
          },
        };
      },
      invalidatesTags: ["Categories"],
    }),
    getListProjects: builder.query<
      { _id: string; name: string }[],
      { userId: string | null }
    >({
      query: ({ userId }) => ({
        url: `projects/getlist/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: {
        projects: { _id: string; name: string }[];
      }) => response.projects,
      providesTags: ["Projects"],
    }),
    addListProjects: builder.mutation<
      { name?: string; id_project?: string; message?: string },
      { userId: string | null; name: string }
    >({
      query({ name, userId }) {
        return {
          url: "projects",
          method: "POST",
          body: {
            name,
            userId,
          },
        };
      },
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation<
      { message?: string },
      { projectId?: string }
    >({
      query({ projectId }) {
        return {
          url: "projects/" + projectId,
          method: "DELETE",
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: true }));
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: false }));
      },
      invalidatesTags: (result) =>
        typeof result !== "undefined" ? ["Projects"] : [],
    }),
    getProjectBoard: builder.query<
      { message?: string; result: any[] | null },
      { projectId: string | undefined }
    >({
      query({ projectId }) {
        return {
          url: "projects/" + projectId,
          method: "GET",
        };
      },
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation<
      { status: string },
      { name: string; projectId: string | undefined }
    >({
      query({ name, projectId }) {
        return {
          url: "categories",
          method: "POST",
          body: {
            name,
            projectId,
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: true }));
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: false }));
      },
      invalidatesTags: (result) =>
        typeof result !== "undefined" ? ["Categories"] : [],
    }),
    deleteCategory: builder.mutation<void, { categoryId: string | undefined }>({
      query({ categoryId }) {
        return {
          url: "categories/" + categoryId,
          method: "DELETE",
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: true }));
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: false }));
      },
      invalidatesTags: (result) =>
        typeof result !== "undefined" ? ["Categories"] : [],
    }),
  }),
});

export const {
  useGetListProjectsQuery,
  useAddListProjectsMutation,
  useDeleteProjectMutation,
  useGetProjectBoardQuery,
  useAddTaskMutation,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = projectsApi;
export const kanbanReducerState = kanbanSlice.getInitialState;
export const kanbanActions = kanbanSlice.actions;
export default kanbanSlice;
