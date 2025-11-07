import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch user's payment methods
export const fetchPaymentMethods = createAsyncThunk(
    'payment/fetchPaymentMethods',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await fetch('/api/payments', {
                headers: {
                    'x-auth-token': token
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.msg || 'Failed to fetch payment methods');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Add a new payment method
export const addPaymentMethod = createAsyncThunk(
    'payment/addPaymentMethod',
    async (paymentMethodId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ paymentMethodId })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.msg || 'Failed to add payment method');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Delete a payment method
export const deletePaymentMethod = createAsyncThunk(
    'payment/deletePaymentMethod',
    async (paymentMethodId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await fetch(`/api/payments/${paymentMethodId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.msg || 'Failed to delete payment method');
            }

            return paymentMethodId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Set default payment method
export const setDefaultPaymentMethod = createAsyncThunk(
    'payment/setDefaultPaymentMethod',
    async (paymentMethodId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await fetch(`/api/payments/${paymentMethodId}/default`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.msg || 'Failed to set default payment method');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        paymentMethods: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Payment Methods
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload;
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Payment Method
            .addCase(addPaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods.push(action.payload);
            })
            .addCase(addPaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Payment Method
            .addCase(deletePaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
            })
            .addCase(deletePaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Set Default Payment Method
            .addCase(setDefaultPaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload;
            })
            .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const selectPaymentMethods = (state) => state.payment.paymentMethods;
export const selectPaymentsLoading = (state) => state.payment.loading;
export const selectPaymentsError = (state) => state.payment.error;

export default paymentSlice.reducer;