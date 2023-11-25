import { API_BASE_URL } from "../../config/serverApiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const taskApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
});

export default taskApi;
