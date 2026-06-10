import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ticketReducer from './slices/ticketSlice';
import userReducer from './slices/userSlice';
import notifReducer from './slices/notifSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    users: userReducer,
    notifications: notifReducer,
  },
});

export default store;
