import axiosInstance from './axiosInstance';
import { mockDb } from './mockDb';
import { getDemoMode, setDemoMode } from './authAPI';

export const ticketsAPI = {
  getTickets: async (filters = {}) => {
    const currentUser = mockDb.getCurrentUser();
    if (getDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDb.getTickets(filters, currentUser);
    }
    try {
      const response = await axiosInstance.get('/tickets', { params: filters });
      return response.data;
    } catch (error) {
      if (!error.response) {
        console.warn('Backend offline, using demo data.');
        setDemoMode(true);
        return mockDb.getTickets(filters, currentUser);
      }
      throw error;
    }
  },

  getTicketById: async (id) => {
    if (getDemoMode()) {
      return mockDb.getTicketById(id);
    }
    try {
      const response = await axiosInstance.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.getTicketById(id);
      }
      throw error;
    }
  },

  createTicket: async (ticketData) => {
    const currentUser = mockDb.getCurrentUser();
    if (getDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDb.createTicket(ticketData, currentUser);
    }
    try {
      const response = await axiosInstance.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.createTicket(ticketData, currentUser);
      }
      throw error;
    }
  },

  updateTicket: async (id, updates) => {
    if (getDemoMode()) {
      return mockDb.updateTicket(id, updates);
    }
    try {
      const response = await axiosInstance.put(`/tickets/${id}`, updates);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.updateTicket(id, updates);
      }
      throw error;
    }
  },

  assignTicket: async (id, userIds) => {
    if (getDemoMode()) {
      return mockDb.assignTicket(id, userIds);
    }
    try {
      const response = await axiosInstance.post(`/tickets/${id}/assign`, { user_ids: userIds });
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.assignTicket(id, userIds);
      }
      throw error;
    }
  },

  // ── DISCUSSION ──
  getComments: async (ticketId) => {
    if (getDemoMode()) {
      return mockDb.getComments(ticketId);
    }
    try {
      const response = await axiosInstance.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.getComments(ticketId);
      }
      throw error;
    }
  },

  addComment: async (ticketId, commentData) => {
    const currentUser = mockDb.getCurrentUser();
    if (getDemoMode()) {
      return mockDb.addComment(ticketId, commentData, currentUser);
    }
    try {
      const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, commentData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.addComment(ticketId, commentData, currentUser);
      }
      throw error;
    }
  },

  // ── NOTIFICATIONS ──
  getNotifications: async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return [];
    if (getDemoMode()) {
      return mockDb.getNotifications(currentUser.id);
    }
    try {
      const response = await axiosInstance.get('/notifications');
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.getNotifications(currentUser.id);
      }
      throw error;
    }
  },

  markNotificationsRead: async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return [];
    if (getDemoMode()) {
      return mockDb.markNotificationsRead(currentUser.id);
    }
    try {
      const response = await axiosInstance.post('/notifications/read');
      return response.data;
    } catch (error) {
      if (!error.response) {
        setDemoMode(true);
        return mockDb.markNotificationsRead(currentUser.id);
      }
      throw error;
    }
  }
};

export default ticketsAPI;
