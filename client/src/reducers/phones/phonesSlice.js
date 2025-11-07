import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to calculate discount
const calculateDiscount = () => {
  return Math.floor(Math.random() * (20 - 15 + 1)) + 15; // 15-20% discount
};

// Fetch all phones
export const fetchPhones = createAsyncThunk(
  'phones/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/phones');
      return response.data.map(phone => ({
        ...phone,
        discountPercentage: calculateDiscount(),
        discountedPrice: (phone.price * (1 - calculateDiscount() / 100)).toFixed(2)
      }));
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const phonesSlice = createSlice({
  name: 'phones',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhones.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPhones.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPhones.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default phonesSlice.reducer;