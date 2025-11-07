import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all phones
export const fetchAdminPhones = createAsyncThunk(
    'adminProduct/fetchAdminPhones',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/phones');
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

// Add phone
export const addAdminPhone = createAsyncThunk(
    'adminProduct/addAdminPhone',
    async (phoneData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const formData = new FormData();
            Object.keys(phoneData).forEach(key => {
                if (Array.isArray(phoneData[key])) {
                    formData.append(key, JSON.stringify(phoneData[key]));
                } else {
                    formData.append(key, phoneData[key]);
                }
            });

            const response = await axios.post('/api/admin/phones', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

// Delete phone
export const deleteAdminPhone = createAsyncThunk(
    'adminProduct/deleteAdminPhone',
    async (phoneId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            await axios.delete(`/api/admin/phones/${phoneId}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            return phoneId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

// Update phone
export const updateAdminPhone = createAsyncThunk(
    'adminProduct/updateAdminPhone',
    async ({ id, phoneData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const formData = new FormData();
            Object.keys(phoneData).forEach(key => {
                if (Array.isArray(phoneData[key])) {
                    formData.append(key, JSON.stringify(phoneData[key]));
                } else {
                    formData.append(key, phoneData[key]);
                }
            });

            const response = await axios.put(`/api/admin/phones/${id}`, formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

const adminProductSlice = createSlice({
    name: 'adminProduct',
    initialState: {
        phones: [],
        loading: false,
        error: null
    },
    reducers: {
        clearAdminProductError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Phones
            .addCase(fetchAdminPhones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminPhones.fulfilled, (state, action) => {
                state.loading = false;
                state.phones = action.payload;
            })
            .addCase(fetchAdminPhones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Phone
            .addCase(addAdminPhone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAdminPhone.fulfilled, (state, action) => {
                state.loading = false;
                state.phones.push(action.payload);
            })
            .addCase(addAdminPhone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Phone
            .addCase(deleteAdminPhone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdminPhone.fulfilled, (state, action) => {
                state.loading = false;
                state.phones = state.phones.filter(phone => phone._id !== action.payload);
            })
            .addCase(deleteAdminPhone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Phone
            .addCase(updateAdminPhone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdminPhone.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.phones.findIndex(phone => phone._id === action.payload._id);
                if (index !== -1) {
                    state.phones[index] = action.payload;
                }
            })
            .addCase(updateAdminPhone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Memoized selector for phones
export const selectAdminPhones = createSelector(
    [(state) => state.adminProduct.phones],
    (phones) => phones
);

export const selectAdminProductLoading = (state) => state.adminProduct.loading;
export const selectAdminProductError = (state) => state.adminProduct.error;

export const { clearAdminProductError } = adminProductSlice.actions;

export default adminProductSlice.reducer;