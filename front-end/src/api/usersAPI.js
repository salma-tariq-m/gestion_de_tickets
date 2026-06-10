import axiosInstance from './axiosInstance';
import { mockDb } from './mockDb';
import { getDemoMode, setDemoMode } from './authAPI';

export const usersAPI = {
  // ── USER MANAGEMENT ──
  getUsers: async () => {
    if (getDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDb.getUsers();
    }
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.getUsers();
      }
      throw error;
    }
  },

  createUser: async (userData) => {
    if (getDemoMode()) {
      return mockDb.createUser(userData);
    }
    try {
      const response = await axiosInstance.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.createUser(userData);
      }
      throw error;
    }
  },

  updateUser: async (id, updates) => {
    if (getDemoMode()) {
      return mockDb.updateUser(id, updates);
    }
    try {
      const response = await axiosInstance.put(`/admin/users/${id}`, updates);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.updateUser(id, updates);
      }
      throw error;
    }
  },

  deleteUser: async (id) => {
    if (getDemoMode()) {
      return mockDb.deleteUser(id);
    }
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      return true;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.deleteUser(id);
      }
      throw error;
    }
  },

  // ── CATEGORIES MANAGEMENT ──
  getCategories: async () => {
    if (getDemoMode()) {
      return mockDb.getCategories();
    }
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.getCategories();
      }
      throw error;
    }
  },

  createCategory: async (catData) => {
    if (getDemoMode()) {
      return mockDb.createCategory(catData);
    }
    try {
      const response = await axiosInstance.post('/categories', catData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.createCategory(catData);
      }
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    if (getDemoMode()) {
      return mockDb.updateCategory(id, updates);
    }
    try {
      const response = await axiosInstance.put(`/categories/${id}`, updates);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.updateCategory(id, updates);
      }
      throw error;
    }
  },

  deleteCategory: async (id) => {
    if (getDemoMode()) {
      return mockDb.deleteCategory(id);
    }
    try {
      await axiosInstance.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.deleteCategory(id);
      }
      throw error;
    }
  }
};

export default usersAPI;
