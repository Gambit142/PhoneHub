import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch single phone
export const fetchPhoneDetails = createAsyncThunk(
    'phones/fetchDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/phones/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const phoneDetailsSlice = createSlice({
    name: 'phoneDetails',
    initialState: {
        item: null,
        status: 'idle',
        error: null
    },
    reducers: {
        clearPhoneDetails: (state) => {
            state.item = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhoneDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPhoneDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.item = action.payload;
            })
            .addCase(fetchPhoneDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearPhoneDetails } = phoneDetailsSlice.actions;
export default phoneDetailsSlice.reducer;