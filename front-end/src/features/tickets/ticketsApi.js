import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Ticket', 'Comment'],
  endpoints: (builder) => ({
    /** GET /api/tickets */
    getTickets: builder.query({
      query: (params = {}) => ({ url: '/tickets', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Ticket', id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    /** GET /api/tickets/:id */
    getTicket: builder.query({
      query: (id) => `/tickets/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Ticket', id }],
    }),

    /** POST /api/tickets */
    createTicket: builder.mutation({
      query: (body) => ({ url: '/tickets', method: 'POST', body }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    /** PATCH /api/tickets/:id */
    updateTicket: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Ticket', id }],
    }),

    /** PATCH /api/tickets/:id/status */
    changeTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),

    /** PATCH /api/tickets/:id/assign */
    assignTicket: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/tickets/${id}/assign`,
        method: 'PATCH',
        body: { user_id: userId },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Ticket', id }],
    }),

    /** POST /api/tickets/:id/comments */
    addComment: builder.mutation({
      query: ({ ticketId, body }) => ({
        url: `/tickets/${ticketId}/comments`,
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: (_r, _e, { ticketId }) => [
        { type: 'Ticket', id: ticketId },
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useChangeTicketStatusMutation,
  useAssignTicketMutation,
  useAddCommentMutation,
} = ticketsApi;
