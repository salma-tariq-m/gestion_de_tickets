import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketsAPI from '../../api/ticketsAPI';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await ticketsAPI.getTickets(filters);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await ticketsAPI.getTicketById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createNewTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, { rejectWithValue }) => {
    try {
      return await ticketsAPI.createTicket(ticketData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await ticketsAPI.updateTicket(id, { status });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateTicketPriority = createAsyncThunk(
  'tickets/updatePriority',
  async ({ id, priority }, { rejectWithValue }) => {
    try {
      return await ticketsAPI.updateTicket(id, { priority });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const assignTicketUsers = createAsyncThunk(
  'tickets/assignUsers',
  async ({ id, userIds }, { rejectWithValue }) => {
    try {
      return await ticketsAPI.assignTicket(id, userIds);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'tickets/fetchComments',
  async (ticketId, { rejectWithValue }) => {
    try {
      return await ticketsAPI.getComments(ticketId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addTicketComment = createAsyncThunk(
  'tickets/addComment',
  async ({ ticketId, content, isInternal }, { rejectWithValue }) => {
    try {
      return await ticketsAPI.addComment(ticketId, { content, isInternal });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (id, { rejectWithValue }) => {
    try {
      return await ticketsAPI.updateTicket(id, { status: 'ferme' });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    list: [],
    currentTicket: null,
    comments: [],
    filters: {
      status: '',
      priority: '',
      categoryId: '',
      search: '',
      myTicketsOnly: false,
    },
    loading: false,
    detailLoading: false,
    commentsLoading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: '',
        priority: '',
        categoryId: '',
        search: '',
        myTicketsOnly: false,
      };
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.comments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Ticket By Id
      .addCase(fetchTicketById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Create Ticket
      .addCase(createNewTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createNewTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status / Priority / Assign
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
        if (state.currentTicket && state.currentTicket.id === action.payload.id) {
          state.currentTicket = { ...state.currentTicket, ...action.payload };
        }
      })
      .addCase(updateTicketPriority.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
        if (state.currentTicket && state.currentTicket.id === action.payload.id) {
          state.currentTicket = { ...state.currentTicket, ...action.payload };
        }
      })
      .addCase(assignTicketUsers.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
        if (state.currentTicket && state.currentTicket.id === action.payload.id) {
          state.currentTicket = { ...state.currentTicket, ...action.payload };
        }
      })
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.commentsLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.commentsLoading = false;
      })
      // Add Comment
      .addCase(addTicketComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        if (state.currentTicket) {
          state.currentTicket.comments_count = (state.currentTicket.comments_count || 0) + 1;
        }
      })
      // Close Ticket
      .addCase(closeTicket.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
        if (state.currentTicket && state.currentTicket.id === action.payload.id) {
          state.currentTicket = { ...state.currentTicket, ...action.payload };
        }
      });
  },
});

export const { setFilter, resetFilters, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
