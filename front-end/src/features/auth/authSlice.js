import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();

/**
 * @typedef {{ id: number, name: string, email: string, role: string }} User
 * @typedef {{ user: User|null, token: string|null, isAuthenticated: boolean, isLoading: boolean }} AuthState
 */

/** @type {AuthState} */
const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Appel après login réussi */
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    /** Mise à jour du profil utilisateur */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    /** Déconnexion */
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUser, clearCredentials, setLoading } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentToken = (state) => state.auth.token;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
