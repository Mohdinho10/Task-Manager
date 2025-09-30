import { TASKS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Get dashboard data
    getDashboardData: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        credentials: "include",
      }),
      providesTags: ["Tasks"],
    }),

    // User: Get user-specific dashboard data
    getUserDashboardData: builder.query({
      query: () => ({
        url: `${TASKS_URL}/user`,
        credentials: "include",
      }),
      providesTags: ["Tasks"],
    }),

    // Get all tasks (with optional filters and pagination)
    getTasks: builder.query({
      query: ({
        status = "all",
        sort = "-createdAt",
        page = 1,
        limit = 10,
      } = {}) => ({
        url: `${TASKS_URL}/tasks`,
        params: {
          status: status === "all" ? "" : status,
          sort,
          page,
          limit,
        },
        credentials: "include",
      }),
      transformResponse: (response) => ({
        tasks: response.tasks,
        statusSummary: response.statusSummary,
        pagination: response.pagination,
      }),
      providesTags: ["Tasks"],
    }),

    // Get a single task by ID
    getTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    // Create a new task (admin)
    createTask: builder.mutation({
      query: (taskData) => ({
        url: TASKS_URL,
        method: "POST",
        body: taskData,
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Update a task (admin)
    updateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Delete a task (admin)
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Update task status
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${TASKS_URL}/${id}/status`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Update checklist
    updateTaskChecklist: builder.mutation({
      query: ({ id, todoChecklist }) => ({
        url: `${TASKS_URL}/${id}/todo`,
        method: "PUT",
        body: { todoChecklist },
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),
    getComments: builder.query({
      query: (taskId) => ({
        url: `${TASKS_URL}/${taskId}/comments`,
        credentials: "include",
      }),
      providesTags: (result, error, taskId) => [
        { type: "Comments", id: taskId },
      ],
    }),

    addComment: builder.mutation({
      query: ({ taskId, text, mentions }) => ({
        url: `${TASKS_URL}/${taskId}/comments`,
        method: "POST",
        body: { text, mentions },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
      ],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetUserDashboardDataQuery,
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskChecklistMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
} = tasksApiSlice;
