import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    register: builder.mutation({
      query: (formData) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: formData,
        credentials: "include", // important for cookie-based sessions
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include", // include credentials at login
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User"], // Force refresh of user-related queries
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // Admin-only
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        credentials: "include",
      }),
      providesTags: ["Users"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "Users",
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
