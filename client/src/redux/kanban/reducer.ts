import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as kanbanTypes from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";

export interface ITask {
  _id: string;
  name: string;
  description: string;
  category_id: string;
  attachment: {
    link: string;
    type: string;
  }[];
}

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
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
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
      { projectId: string }
    >({
      query({ projectId }) {
        return {
          url: "projects/" + projectId,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Projects"],
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
    }),
  }),
});

export const {
  useGetListProjectsQuery,
  useAddListProjectsMutation,
  useDeleteProjectMutation,
  useGetProjectBoardQuery,
} = projectsApi;
export const kanbanReducerState = kanbanSlice.getInitialState;
export const kanbanActions = kanbanSlice.actions;
export default kanbanSlice;
