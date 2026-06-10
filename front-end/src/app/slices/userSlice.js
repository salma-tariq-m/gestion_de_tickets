import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersAPI from '../../api/usersAPI';

// ── UTISATEURS ──
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await usersAPI.getUsers();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'users/create',
  async (userData, { rejectWithValue }) => {
    try {
      return await usersAPI.createUser(userData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAdminUser = createAsyncThunk(
  'users/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await usersAPI.updateUser(id, updates);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersAPI.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── CATÉGORIES ──
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await usersAPI.getCategories();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (catData, { rejectWithValue }) => {
    try {
      return await usersAPI.createCategory(catData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      return await usersAPI.updateCategory(id, { name });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersAPI.deleteCategory(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    categories: [],
    loading: false,
    categoriesLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update User
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) {
          state.users[idx] = action.payload;
        }
      })
      // Delete User
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) {
          state.categories[idx] = action.payload;
        }
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
