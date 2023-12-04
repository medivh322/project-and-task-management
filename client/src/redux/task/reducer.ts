import { API_BASE_URL } from "../../config/serverApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import { String } from "lodash";
import { projectsApi } from "../kanban/reducer";
import { commonReducerAction } from "../common/reducer";

const taskApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Task", "Attachments"],
  endpoints: (builder) => ({
    getTaskInfo: builder.query<
      {
        result: {
          name: string;
          description: string;
        };
        message?: string;
      },
      { taskId: string | undefined }
    >({
      query: ({ taskId }) => ({
        url: "tasks/" + taskId,
        method: "GET",
      }),
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
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: true }));
        try {
          await queryFulfilled;
          dispatch(projectsApi.util.invalidateTags(["Categories"]));
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
        dispatch(commonReducerAction.LOADING_FULLSCREEN({ loading: false }));
      },
    }),
    getAttachments: builder.query<
      {
        result: {
          _id: string;
          attachment: {
            _id: string;
            name: string;
            date_upload: string;
            url: string;
            file_id: string;
          }[];
        };
      },
      { taskId: string | undefined }
    >({
      query: ({ taskId }) => ({
        url: "tasks/attachments/" + taskId,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Attachments"],
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
} = taskApi;
export default taskApi;
