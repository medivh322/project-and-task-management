import { API_BASE_URL } from "../../config/serverApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { projectsApi } from "../kanban/reducer";
import { commonReducerAction } from "../common/reducer";
import { Key } from "antd/es/table/interface";

const taskApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Task", "Attachments", "Members"],
  endpoints: (builder) => ({
    getTaskInfo: builder.query<
      {
        name: string;
        description: string;
        date_start: string;
      },
      { taskId: string | undefined }
    >({
      query: ({ taskId }) => ({
        url: "tasks/" + taskId,
        method: "GET",
      }),
      transformResponse: (response: {
        task: {
          name: string;
          description: string;
          date_start: string;
        };
      }) => {
        const originalDate = new Date(response.task.date_start);
        return {
          ...response.task,
          date_start: `${originalDate.getFullYear()}-${(
            originalDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${originalDate
            .getDate()
            .toString()
            .padStart(2, "0")}`,
        };
      },
      keepUnusedDataFor: 0,
    }),
    saveTaskInfo: builder.mutation<
      {
        success: boolean;
      },
      {
        taskId: string | undefined;
        body: {
          name: string;
          description: string;
        };
      }
    >({
      query: ({ taskId, body }) => ({
        url: "tasks/" + taskId,
        method: "PUT",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
    }),
    deleteTask: builder.mutation<
      void,
      {
        taskId: string | undefined;
      }
    >({
      query: ({ taskId }) => ({
        url: "tasks/" + taskId,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(projectsApi.util.invalidateTags(["Categories"]));
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
    }),
    getAttachments: builder.query<
      {
        _id: string;
        name: string;
        date_upload: string;
        url: string;
        file_id: string;
      }[],
      { taskId: string | undefined }
    >({
      query: ({ taskId }) => ({
        url: "tasks/attachments/" + taskId,
        method: "GET",
      }),
      transformResponse: (response: {
        attachments: {
          _id: string;
          name: string;
          date_upload: string;
          url: string;
          file_id: string;
        }[];
      }) => {
        return response.attachments.map((attachment) => {
          const originalDate = new Date(attachment.date_upload);
          return {
            ...attachment,
            date_upload: `${originalDate.getFullYear()}-${(
              originalDate.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${originalDate
              .getDate()
              .toString()
              .padStart(2, "0")}`,
          };
        });
      },
      keepUnusedDataFor: 0,
      providesTags: ["Attachments"],
    }),
    getStatuses: builder.query<
      { statuses: { key: string; name: string; selected: boolean }[] },
      { projectId: string | undefined; taskId: string | undefined }
    >({
      query: ({ projectId, taskId }) => ({
        url: "tasks/statuses/" + projectId + "/" + taskId,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    searchMembersTask: builder.mutation<
      {
        key: string;
        name: string;
      }[],
      { projectId: string | undefined; query: string }
    >({
      query: ({ projectId, query }) => ({
        url: "tasks/s/members",
        method: "GET",
        params: {
          projectId,
          query,
        },
      }),
      transformResponse: (response: {
        members: {
          key: string;
          name: string;
        }[];
      }) => response.members,
    }),
    setMemberTask: builder.mutation<
      void,
      { membersArray: Key[]; taskId: string | undefined }
    >({
      query: ({ membersArray, taskId }) => ({
        url: "tasks/members",
        method: "POST",
        body: {
          membersArray,
          taskId,
        },
      }),
      invalidatesTags: ["Members"],
    }),
    getMembersTask: builder.query<
      {
        _id: string;
        name: string;
      }[],
      { taskId: string | undefined }
    >({
      query({ taskId }) {
        return {
          url: "tasks/members/" + taskId,
          method: "GET",
        };
      },
      transformResponse: (response: {
        members: { _id: string; name: string }[];
      }) => response.members,
      providesTags: ["Members"],
    }),
    changeStatus: builder.mutation<
      void,
      { categoryId: Key; taskId: string | undefined }
    >({
      query: ({ categoryId, taskId }) => ({
        url: "tasks/statuses",
        body: {
          categoryId,
          taskId,
        },
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(projectsApi.util.invalidateTags(["Categories"]));
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
    }),
    uploadFile: builder.mutation<
      void,
      {
        taskId: string | undefined;
        file: File;
      }
    >({
      query: ({ taskId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("Content-Type", file.type);
        return {
          url: "upload/" + taskId,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Attachments"],
    }),
    deleteFile: builder.mutation<
      void,
      {
        fileId: string | undefined;
      }
    >({
      query: ({ fileId }) => {
        return {
          url: "file/" + fileId,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Attachments"],
    }),
  }),
});

export const {
  useGetTaskInfoQuery,
  useSaveTaskInfoMutation,
  useGetAttachmentsQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
  useDeleteTaskMutation,
  useGetStatusesQuery,
  useChangeStatusMutation,
  useSearchMembersTaskMutation,
  useSetMemberTaskMutation,
  useGetMembersTaskQuery,
} = taskApi;
export default taskApi;
