import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.msg || 'Login failed');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return rejectWithValue(text || 'Server returned non-JSON response');
            }

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.msg || 'Registration failed');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await fetch('/api/auth/me', {
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
                return rejectWithValue(data.msg || 'Failed to fetch user');
            }

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Current User
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
            });
    }
});

export const { logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;