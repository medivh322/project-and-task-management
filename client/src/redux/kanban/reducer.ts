import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { commonReducerAction } from "../common/reducer";
import { Key } from "antd/es/table/interface";
import { Category, ProjectListItem, Task } from "../../types/models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  CHANGE_STATUS_TASK,
  CHANGE_STATUS_UPLOAD_FILE,
  CLOSE_TASK,
  DELETE_TASK,
  KANBAN_REDUCER,
  SET_BOARDDATA,
  SET_NEW_CATEGORY,
  SET_NEW_TASK,
  SET_PROJECT_LIST,
  SET_STATUS_LOADING_PROJECT_LIST,
} from "./types";

interface IKanbanState {
  projectList: ProjectListItem[] | null;
  boardData: Category[] | null;
  curIdBoard: string | null;
  loadingGetProjectList: boolean;
  uploadingFile: boolean;
}

const initialState: IKanbanState = {
  projectList: null,
  loadingGetProjectList: false,
  boardData: null,
  curIdBoard: null,
  uploadingFile: false,
};

const kanbanSlice = createSlice({
  name: KANBAN_REDUCER,
  initialState,
  reducers: {
    [SET_PROJECT_LIST]: (
      state,
      action: PayloadAction<{
        projectList: ProjectListItem[];
      }>
    ) => {
      state.projectList = action.payload.projectList;
    },
    [SET_STATUS_LOADING_PROJECT_LIST]: (
      state,
      action: PayloadAction<{
        status: boolean;
      }>
    ) => {
      state.loadingGetProjectList = action.payload.status;
    },
    [SET_BOARDDATA]: (
      state,
      action: PayloadAction<{
        categories: Category[];
        curIdBoard: string;
      }>
    ) => {
      state.boardData = action.payload.categories;
      state.curIdBoard = action.payload.curIdBoard;
    },
    [SET_NEW_CATEGORY]: (
      state,
      action: PayloadAction<{
        category: Category;
      }>
    ) => {
      if (state.boardData !== null) {
        state.boardData = [...state.boardData, action.payload.category];
      }
    },
    [SET_NEW_TASK]: (
      state,
      action: PayloadAction<{
        task: Task;
        categoryId: string;
      }>
    ) => {
      if (action.payload.categoryId !== null && state.boardData !== null) {
        const index = state.boardData?.findIndex(
          (category) => category._id === action.payload.categoryId
        );
        state.boardData[index].tasks.push(action.payload.task);
      }
    },
    [DELETE_TASK]: (
      state,
      action: PayloadAction<{
        taskId: string;
      }>
    ) => {
      if (action.payload.taskId !== null && state.boardData !== null) {
        state.boardData.forEach((category, iCategory) => {
          category.tasks.forEach((task, iTask) => {
            if (task._id === action.payload.taskId && state.boardData) {
              state.boardData[iCategory].tasks.splice(iTask, 1);
            }
          });
        });
      }
    },
    [CLOSE_TASK]: (
      state,
      action: PayloadAction<{
        taskId: string;
      }>
    ) => {
      if (action.payload.taskId !== null && state.boardData !== null) {
        state.boardData.forEach((category, iCategory) => {
          category.tasks.forEach((task, iTask) => {
            if (task._id === action.payload.taskId && state.boardData) {
              state.boardData[iCategory].tasks[iTask].status = "close";
            }
          });
        });
      }
    },
    [CHANGE_STATUS_TASK]: (
      state,
      action: PayloadAction<{
        categoryId: string;
        taskId: string;
      }>
    ) => {
      if (action.payload.taskId !== null && state.boardData !== null) {
        let copy: Task | null = null;
        state.boardData.forEach((category, iCategory) => {
          category.tasks.forEach((task, iTask) => {
            if (task._id === action.payload.taskId && state.boardData) {
              copy = state.boardData[iCategory].tasks[iTask];
              state.boardData[iCategory].tasks.splice(iTask, 1);
            }
          });
        });
        if (copy) {
          state.boardData.forEach((category, iCategory) => {
            if (category._id === action.payload.categoryId && state.boardData)
              state.boardData[iCategory].tasks.push(copy as Task);
          });
        }
      }
    },
    [CHANGE_STATUS_UPLOAD_FILE]: (
      state,
      action: PayloadAction<{
        status: boolean;
      }>
    ) => {
      state.uploadingFile = action.payload.status;
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
    addTask: builder.mutation<
      { result: Task },
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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            kanbanSlice.actions[SET_NEW_TASK]({
              categoryId: arg.categoryId as string,
              task: data.result,
            })
          );
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
    }),
    getListProjects: builder.query<
      ProjectListItem[] | [],
      { userId: string | null }
    >({
      query: ({ userId }) => ({
        url: `projects/getlist/${userId}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            kanbanSlice.actions["SET_PROJECT_LIST"]({ projectList: data })
          );
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
      transformResponse: (response: { projects: ProjectListItem[] | [] }) =>
        response.projects,
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
      Category[],
      { projectId: string | undefined }
    >({
      query({ projectId }) {
        return {
          url: "projects/" + projectId,
          method: "GET",
        };
      },
      transformResponse: (response: { result: Category[] }) => response.result,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            kanbanSlice.actions[SET_BOARDDATA]({
              categories: data,
              curIdBoard: arg.projectId as string,
            })
          );
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
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
        name: string;
        key: string;
        role: string;
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
        members: {
          name: string;
          key: string;
          role: string;
        }[];
      }) => response.members,
      providesTags: ["Members"],
    }),
    addCategory: builder.mutation<
      Category,
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
      transformResponse: (response: { result: Category }) => response.result,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(kanbanSlice.actions[SET_NEW_CATEGORY]({ category: data }));
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
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
} = projectsApi;
export const kanbanReducerState = kanbanSlice.getInitialState;
export const kanbanReducerAction = kanbanSlice.actions;
export default kanbanSlice;
