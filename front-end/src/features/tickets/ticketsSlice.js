import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {{ status: string|null, priority: string|null, keyword: string, page: number, selectedTicketId: number|null }} TicketsState
 */

/** @type {TicketsState} */
const initialState = {
  filters: {
    status: null,
    priority: null,
    keyword: '',
    dateFrom: null,
    dateTo: null,
    assignedTo: null,
  },
  page: 1,
  selectedTicketId: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      state.page = 1; // Retour à la page 1 à chaque filtre
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSelectedTicket: (state, action) => {
      state.selectedTicketId = action.payload;
    },
  },
});

export const { setFilter, resetFilters, setPage, setSelectedTicket } =
  ticketsSlice.actions;

// Selectors
export const selectFilters = (state) => state.tickets.filters;
export const selectPage = (state) => state.tickets.page;
export const selectSelectedTicketId = (state) => state.tickets.selectedTicketId;

export default ticketsSlice.reducer;
