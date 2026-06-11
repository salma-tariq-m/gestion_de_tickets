import axiosInstance from './axiosInstance';
import { mockDb } from './mockDb';

// Variable de configuration globale pour forcer le mode démo/simulation si pas de serveur actif
let isDemoMode = false; // Désactive le mode démo pour utiliser le backend Laravel réel

export const setDemoMode = (val) => {
  isDemoMode = val;
};

export const getDemoMode = () => isDemoMode;

export const authAPI = {
  login: async (email, password) => {
    if (isDemoMode) {
      // Simuler une petite latence réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockDb.login(email, password);
    }
    try {
      const response = await axiosInstance.post('/auth/login', { email, password,password_confirmation });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      if (!error.response) {
        console.log(error)
        // Fallback automatique sur erreur réseau
        console.warn('Backend injoignable, bascule en mode Démo.');
        isDemoMode = true;
        return mockDb.login(email, password);
      }
      throw error;
    }
  },

  register: async (name, email, password) => {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockDb.register(name, email, password);
    }
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      if (!error.response) {
        console.warn('Backend injoignable, bascule en mode Démo.');
        isDemoMode = true;
        return mockDb.register(name, email, password);
      }
      throw error;
    }
  },

  logout: async () => {
    if (isDemoMode) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    }
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return true;
  },

  getMe: async () => {
    if (isDemoMode) {
      return mockDb.getCurrentUser();
    }
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data.user;
    } catch (error) {
      if (!error.response) {
        return mockDb.getCurrentUser();
      }
      throw error;
    }
  }
};

export default authAPI;
