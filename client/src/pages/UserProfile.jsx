import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, CreditCard, ShoppingBag } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import UserInfo from '../components/user/UserInfo';
import UserPayments from '../components/user/UserPayments';
import UserOrders from '../components/user/UserOrders';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const UserProfile = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const sidebarItems = [
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/profile/payments', label: 'Payments', icon: CreditCard },
        { path: '/profile/orders', label: 'Orders', icon: ShoppingBag },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">My Account</h2>
                            <nav className="space-y-2">
                                {sidebarItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.path ||
                                        (item.path === '/profile' && currentPath === '/profile');

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center px-4 py-3 rounded-md text-sm font-medium 
                                                transition-colors ${isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className="mr-3 h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <Elements stripe={stripePromise}>
                            <Routes>
                                <Route index element={<UserInfo />} />
                                <Route path="payments" element={<UserPayments />} />
                                <Route path="orders" element={<UserOrders />} />
                            </Routes>
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;