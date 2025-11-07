import React, { useState, useEffect } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderDetails from './OrderDetails';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const ordersPerPage = 10;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/orders', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(prev =>
                    prev.map(order =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
                <p className="text-gray-600 mt-2">Manage and track customer orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-600">
                        Showing {currentOrders.length} of {filteredOrders.length} orders
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order._id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">{order.user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                ${order.totalPrice}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-center">
                                <div className="flex space-x-2">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-2 rounded-md text-sm ${currentPage === i + 1
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } border border-gray-300 transition-colors`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default AllOrders;
