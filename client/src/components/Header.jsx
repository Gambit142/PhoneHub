import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Smartphone, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItemsCount, setIsOpen } from '../reducers/cart/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '../reducers/auth/authSlice';
import Logo from '../assests/logo.png';

const Header = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItemsCount = useSelector(selectCartItemsCount);

    const handleLogout = () => {
        dispatch(logout());
        setMobileMenuOpen(false);
        navigate('/');
    };

    const handleCartClick = () => {
        dispatch(setIsOpen(true));
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={Logo} alt="PhoneHub Logo" className="h-12 w-12" />
                        <span className="text-2xl font-bold text-gray-900">PhoneHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        {isAuthenticated && user?.role === 'admin' && (
                            <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                                Admin Dashboard
                            </Link>
                        )}
                        {isAuthenticated && user?.role === 'customer' && (
                            <Link to="/profile/orders" className="text-gray-700 hover:text-blue-600 transition-colors">
                                My Orders
                            </Link>
                        )}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <button
                            onClick={handleCartClick}
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="hidden md:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <User className="h-5 w-5" />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            {isAuthenticated && user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            {isAuthenticated && user?.role === 'customer' && (
                                <Link
                                    to="/orders"
                                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Orders
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;