import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeUsers: number;
  monthlyGrowth: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  user?: { name: string; email: string };
  guestInfo?: { name: string; email: string };
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeUsers: 0,
    monthlyGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/dashboard/stats');
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders);
      setRecentUsers(response.data.recentUsers || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/admin/products/add"
            className="bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Plus className="h-6 w-6" />
            <span className="font-medium">Add Product</span>
          </Link>
          <Link
            to="/admin/products"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Package className="h-6 w-6" />
            <span className="font-medium">Manage Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="font-medium">Manage Orders</span>
          </Link>
          <Link
            to="/admin/users"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Users className="h-6 w-6" />
            <span className="font-medium">Manage Users</span>
          </Link>
          <Link
            to="/admin/payment-slips"
            className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <AlertCircle className="h-6 w-6" />
            <span className="font-medium">Payment Slips</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active listings
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {stats.pendingOrders} pending
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                <Link
                  to="/admin/orders"
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user?.name || order.guestInfo?.name || 'Guest'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <div className="flex space-x-1 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
                <Link
                  to="/admin/users"
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sky-600 dark:text-sky-400 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;