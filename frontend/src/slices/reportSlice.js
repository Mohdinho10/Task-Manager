import { REPORT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Export task report
    exportTasksReport: builder.query({
      query: () => ({
        url: `${REPORT_URL}/export/tasks`,
        credentials: "include",
        responseHandler: async (response) => response.blob(), // handle Excel file
      }),
    }),

    // Export user report
    exportUsersReport: builder.query({
      query: () => ({
        url: `${REPORT_URL}/export/users`,
        credentials: "include",
        responseHandler: async (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useExportTasksReportQuery,
  useExportUsersReportQuery,
  useLazyExportUsersReportQuery,
  useLazyExportTasksReportQuery,
} = reportsApiSlice;
