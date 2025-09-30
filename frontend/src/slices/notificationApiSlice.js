import { NOTIFICATION_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch notifications for logged in user
    getNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATION_URL}`,
        credentials: "include",
      }),
      providesTags: ["Notification"],
    }),

    // Mark a notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATION_URL}/${id}/read`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } =
  notificationApiSlice;
