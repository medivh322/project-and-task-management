import { API_BASE_URL } from "../../config/serverApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import errorHandler, { ErrorRes } from "../../request/errorHundler";
import kanbanSlice from "../kanban/reducer";
import { Key } from "antd/es/table/interface";
import { Attachment, Task } from "../../types/models";
import { CHANGE_STATUS_TASK, CLOSE_TASK, DELETE_TASK } from "../kanban/types";

const taskApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Task", "Attachments", "Members"],
  endpoints: (builder) => ({
    getTaskInfo: builder.query<
      Pick<Task, "name" | "description" | "date_start" | "date_end" | "status">,
      { taskId: string | undefined }
    >({
      query: ({ taskId }) => ({
        url: "tasks/" + taskId,
        method: "GET",
      }),
      transformResponse: (response: {
        task: Pick<
          Task,
          "name" | "description" | "date_start" | "date_end" | "status"
        >;
      }) => response.task,
      keepUnusedDataFor: 0,
    }),
    saveTaskInfo: builder.mutation<
      void,
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
    closeTask: builder.mutation<
      void,
      {
        taskId: string | undefined;
      }
    >({
      query: ({ taskId }) => ({
        url: "tasks/c/" + taskId,
        method: "PUT",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            kanbanSlice.actions[CLOSE_TASK]({
              taskId: arg.taskId as string,
            })
          );
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
          dispatch(
            kanbanSlice.actions[DELETE_TASK]({
              taskId: arg.taskId as string,
            })
          );
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
    }),
    getAttachments: builder.query<Attachment[], { taskId: string | undefined }>(
      {
        query: ({ taskId }) => ({
          url: "tasks/attachments/" + taskId,
          method: "GET",
        }),
        transformResponse: (response: { attachments: Attachment[] }) => {
          return response.attachments.map((attachment) => {
            const originalDate = new Date(attachment.uploadDate);
            return {
              ...attachment,
              uploadDate: `${originalDate.getFullYear()}-${(
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
      }
    ),
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
      string[],
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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            kanbanSlice.actions.SET_MEMBERS({
              members: data,
              taskId: arg.taskId as string,
            })
          );
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
      transformResponse: (response: { members: { name: string }[] }) =>
        response.members.map((member) => member.name),
      invalidatesTags: ["Members"],
    }),
    deleteMembersTask: builder.mutation<
      void,
      { taskId: string | undefined; members: string[] }
    >({
      query({ taskId, members }) {
        return {
          url: "tasks/members/" + taskId,
          body: {
            members,
          },
          method: "DELETE",
        };
      },
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
          dispatch(
            kanbanSlice.actions[CHANGE_STATUS_TASK]({
              taskId: arg.taskId as string,
              categoryId: arg.categoryId as string,
            })
          );
        } catch (error: unknown) {
          errorHandler(error as ErrorRes);
        }
      },
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
  useDeleteFileMutation,
  useCloseTaskMutation,
  useDeleteTaskMutation,
  useGetStatusesQuery,
  useChangeStatusMutation,
  useSearchMembersTaskMutation,
  useSetMemberTaskMutation,
  useGetMembersTaskQuery,
  useDeleteMembersTaskMutation,
} = taskApi;
export default taskApi;
