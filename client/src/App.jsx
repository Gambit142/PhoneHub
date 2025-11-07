import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { store } from './store';
import { selectIsAuthenticated, fetchCurrentUser } from './reducers/auth/authSlice';

// Protected Route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(state => state.auth.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Child component to handle fetching current user
const AppContent = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile/*"
                        element={
                            <ProtectedRoute>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

// Main App component
function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;