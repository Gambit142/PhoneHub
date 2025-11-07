import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Eye, Download, Star } from 'lucide-react';
import { fetchUserOrders, selectUserOrders, 
    selectOrdersLoading, selectOrdersError } from '../../reducers/order/orderSlice';
import { selectIsAuthenticated } from '../../reducers/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const orders = useSelector(selectUserOrders);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/profile/orders' } });
        } else {
            dispatch(fetchUserOrders());
        }
    }, [isAuthenticated, dispatch, navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Track and manage your orders
                </p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                        <p className="text-gray-500">Start shopping to see your orders here</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow">
                            {/* Order Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">
                                                Order #{order._id}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full 
                                            text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-lg font-medium text-gray-900">
                                                ${order.totalPrice.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => toggleOrderDetails(order._id)}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50
                                                 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50
                                             transition-colors">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            {expandedOrder === order._id && (
                                <div className="p-6">
                                    {/* Order Items */}
                                    <div className="space-y-4 mb-6">
                                        <h5 className="font-medium text-gray-900">Order Items</h5>
                                        {order.orderItems.map((item) => (
                                            <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <img
                                                    src={item.phone?.image || 'https://via.placeholder.com/150'}
                                                    alt={item.phone?.model || 'Product'}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <h6 className="font-medium text-gray-900">{item.phone?.model || 'N/A'}</h6>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    {item.selectedColor && <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>}
                                                    {item.selectedStorage && <p className="text-sm text-gray-600">Storage: {item.selectedStorage}</p>}
                                                    {item.selectedRam && <p className="text-sm text-gray-600">RAM: {item.selectedRam}</p>}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                    {order.status === 'delivered' && (
                                                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-1">
                                                            <Star className="h-3 w-3" />
                                                            <span>Rate</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-2">Shipping Information</h5>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Shipping Address: {order.shippingAddress.address}, 
                                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}, 
                                                    {order.shippingAddress.country}</p>
                                                <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-2">Order Summary</h5>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>${order.itemsPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Shipping:</span>
                                                    <span>${order.shippingPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tax:</span>
                                                    <span>${order.taxPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-1 flex justify-between font-medium text-gray-900">
                                                    <span>Total:</span>
                                                    <span>${order.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserOrders;