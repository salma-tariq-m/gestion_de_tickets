import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketsAPI from '../../api/ticketsAPI';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ticketsAPI.getNotifications();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  'notifications/markRead',
  async (_, { rejectWithValue }) => {
    try {
      return await ticketsAPI.markNotificationsRead();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const notifSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    unreadCount: 0,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        state.list = action.payload;
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notifSlice.actions;
export default notifSlice.reducer;
