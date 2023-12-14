import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as kanbanTypes from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { commonReducerAction } from "../common/reducer";
import { Key } from "antd/es/table/interface";

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
  tagTypes: ["Projects", "Categories", "Members"],
  endpoints: (builder) => ({
    checkAccessRole: builder.query<
      void,
      {
        projectId: string | undefined;
        userId: string | null;
        accessRole: string;
      }
    >({
      query: ({ userId, projectId, accessRole }) => ({
        url: `role`,
        body: {
          userId,
          projectId,
          accessRole,
        },
        method: "POST",
      }),
    }),
    addTask: builder.mutation<
      { status: string },
      { categoryId: string | null; name: string; projectId: string | undefined }
    >({
      query({ name, categoryId, projectId }) {
        return {
          url: "tasks",
          method: "POST",
          body: {
            name,
            categoryId,
            projectId,
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
      void,
      { projectId?: string; userId: string | null }
    >({
      query({ projectId, userId }) {
        return {
          url: "projects/" + projectId,
          body: {
            projectId,
            userId,
          },
          method: "DELETE",
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
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
    shareMembers: builder.mutation<
      void,
      { membersArray: Key[]; projectId: string | undefined }
    >({
      query({ membersArray, projectId }) {
        return {
          url: "projects/share",
          method: "POST",
          body: {
            membersArray,
            projectId,
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
      invalidatesTags: ["Members"],
    }),
    searchMembers: builder.mutation<
      {
        key: string;
        name: string;
      }[],
      { query: string; projectId: string | undefined }
    >({
      query({ query, projectId }) {
        return {
          url: "projects/s/members",
          method: "GET",
          params: {
            query,
            id: projectId,
          },
        };
      },
      transformResponse: (response: {
        members: {
          _id: string;
          login: string;
        }[];
      }) => {
        const membersDataForTable = response.members.map((member) => ({
          name: member.login,
          key: member._id,
        }));
        return membersDataForTable;
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
    }),
    getMembersProject: builder.query<
      {
        _id: string;
        name: string;
      }[],
      { projectId: string | undefined }
    >({
      query({ projectId }) {
        return {
          url: "projects/members/" + projectId,
          method: "GET",
        };
      },
      transformResponse: (response: {
        members: { _id: string; name: string }[];
      }) => response.members,
      providesTags: ["Members"],
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
  useSearchMembersMutation,
  useShareMembersMutation,
  useGetMembersProjectQuery,
  useCheckAccessRoleQuery,
} = projectsApi;
export const kanbanReducerState = kanbanSlice.getInitialState;
export const kanbanActions = kanbanSlice.actions;
export default kanbanSlice;
