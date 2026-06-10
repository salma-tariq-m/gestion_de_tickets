import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../api/authAPI';

// Récupération initiale dans le localStorage
const initialToken = localStorage.getItem('token') || null;
let initialUser = null;
try {
  const userStr = localStorage.getItem('user');
  if (userStr) initialUser = JSON.parse(userStr);
} catch (e) {
  console.error('Error parsing user from localStorage', e);
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.login(email, password);
      return data; // Contient { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Erreur lors de la connexion');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.register(name, email, password);
      return data; // Contient { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (err) {
      return rejectWithValue(err.message || 'Erreur de déconnexion');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authAPI.getMe();
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      })
      // Get me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
