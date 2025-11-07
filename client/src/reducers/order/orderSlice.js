import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch user's orders
export const fetchUserOrders = createAsyncThunk(
    'order/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await fetch('/api/orders/myorders', {
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
                return rejectWithValue(data.msg || 'Failed to fetch orders');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Create new order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue, getState }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const { cart } = getState();
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    orderItems: cart.items.map(item => ({
                        phone: item.id,
                        quantity: item.quantity,
                        selectedColor: item.selectedColor,
                        selectedStorage: item.selectedStorage,
                        selectedRam: item.selectedRam
                    })),
                    shippingAddress: orderData.shippingAddress,
                    paymentMethod: orderData.paymentMethod,
                    shippingPrice: Number(cart.shippingFee) // Ensure number
                })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.msg || 'Failed to create order');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        loading: false,
        error: null,
        createdOrder: null
    },
    reducers: {
        clearCreatedOrder: (state) => {
            state.createdOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.createdOrder = action.payload;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCreatedOrder } = orderSlice.actions;

export const selectUserOrders = (state) => state.order.orders;
export const selectOrdersLoading = (state) => state.order.loading;
export const selectOrdersError = (state) => state.order.error;
export const selectCreatedOrder = (state) => state.order.createdOrder;

export default orderSlice.reducer;