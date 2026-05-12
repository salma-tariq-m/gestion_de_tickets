import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketsReducer from '../features/tickets/ticketsSlice';
import { authApi } from '../features/auth/authApi';
import { ticketsApi } from '../features/tickets/ticketsApi';
import { dashboardApi } from '../features/dashboard/dashboardApi';
import { adminApi } from '../features/admin/adminApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ticketsApi.middleware,
      dashboardApi.middleware,
      adminApi.middleware
    ),
});

export default store;
