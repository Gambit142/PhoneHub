import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import {
  fetchAdminOrders,
  fetchTotalUsers,
  fetchTotalProducts,
  fetchSalesData,
  fetchBrandData,
  selectAdminStats,
  selectAdminSalesData,
  selectAdminBrandData,
  selectAdminRecentOrders,
  selectAdminLoading,
  selectAdminError
} from '../../reducers/admin/adminOrderSlice';

const AdminOverview = () => {
  const dispatch = useDispatch();
  const { totalEarnings, totalOrders, totalUsers, totalProducts } = useSelector(selectAdminStats);
  const salesData = useSelector(selectAdminSalesData);
  const brandData = useSelector(selectAdminBrandData);
  const recentOrders = useSelector(selectAdminRecentOrders);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  useEffect(() => {
    dispatch(fetchAdminOrders());
    dispatch(fetchTotalUsers());
    dispatch(fetchTotalProducts());
    dispatch(fetchSalesData());
    dispatch(fetchBrandData());
  }, [dispatch]);

  const statItems = [
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Trend Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
                <p className="text-sm text-gray-600">Monthly sales performance</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'sales' ? `$${value.toLocaleString()}` : value,
                        name === 'sales' ? 'Sales' : 'Orders'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Brand Performance */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Brand Performance</h3>
                <p className="text-sm text-gray-600">Sales by phone brand</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={brandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                    />
                    <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order._id}</p>
                        <p className="text-sm text-gray-600">{order.user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.totalPrice}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'pending'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
