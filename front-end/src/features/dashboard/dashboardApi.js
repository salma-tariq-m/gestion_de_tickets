import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    /** GET /api/reports/summary */
    getSummary: builder.query({
      query: () => '/reports/summary',
    }),

    /** GET /api/notifications */
    getNotifications: builder.query({
      query: () => '/notifications',
      // Polling toutes les 30 secondes
    }),

    /** PATCH /api/notifications/:id/read */
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = dashboardApi;
