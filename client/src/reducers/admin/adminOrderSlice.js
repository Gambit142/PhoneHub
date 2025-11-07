import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch admin orders
export const fetchAdminOrders = createAsyncThunk(
  'adminOrder/fetchAdminOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('/api/admin/orders', {
        headers: {
          'x-auth-token': token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Fetch total users
export const fetchTotalUsers = createAsyncThunk(
  'adminOrder/fetchTotalUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('/api/admin/stats/users', {
        headers: {
          'x-auth-token': token
        }
      });
      return response.data.totalUsers;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Fetch total products
export const fetchTotalProducts = createAsyncThunk(
  'adminOrder/fetchTotalProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/phones');
      return response.data.length;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Fetch monthly sales data
export const fetchSalesData = createAsyncThunk(
  'adminOrder/fetchSalesData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('/api/admin/stats/sales', {
        headers: {
          'x-auth-token': token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Fetch brand sales data
export const fetchBrandData = createAsyncThunk(
  'adminOrder/fetchBrandData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('/api/admin/stats/brands', {
        headers: {
          'x-auth-token': token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState: {
    orders: [],
    totalEarnings: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    salesData: [],
    brandData: [],
    recentOrders: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Admin Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalEarnings = action.payload.reduce((sum, order) => sum + order.totalPrice, 0);
        state.recentOrders = action.payload.slice(0, 5);
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Total Users
      .addCase(fetchTotalUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload;
      })
      .addCase(fetchTotalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Total Products
      .addCase(fetchTotalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.totalProducts = action.payload;
      })
      .addCase(fetchTotalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Sales Data
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Brand Data
      .addCase(fetchBrandData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandData.fulfilled, (state, action) => {
        state.loading = false;
        state.brandData = action.payload;
      })
      .addCase(fetchBrandData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Memoized selector for admin stats
export const selectAdminStats = createSelector(
  [
    (state) => state.adminOrder.totalEarnings,
    (state) => state.adminOrder.totalOrders,
    (state) => state.adminOrder.totalUsers,
    (state) => state.adminOrder.totalProducts
  ],
  (totalEarnings, totalOrders, totalUsers, totalProducts) => ({
    totalEarnings,
    totalOrders,
    totalUsers,
    totalProducts
  })
);

export const selectAdminSalesData = (state) => state.adminOrder.salesData;
export const selectAdminBrandData = (state) => state.adminOrder.brandData;
export const selectAdminRecentOrders = (state) => state.adminOrder.recentOrders;
export const selectAdminLoading = (state) => state.adminOrder.loading;
export const selectAdminError = (state) => state.adminOrder.error;

export default adminOrderSlice.reducer;
