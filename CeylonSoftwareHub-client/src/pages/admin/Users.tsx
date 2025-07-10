import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  UserCheck,
  UserX,
  Users as UsersIcon,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedStatus, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        status: selectedStatus
      });

      const response = await axios.get(`/api/admin/users?${params}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
      : 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage user accounts and monitor activity
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sky-600 dark:text-sky-400 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user._id, !user.isActive)}
                            className={`p-2 transition-colors ${
                              user.isActive 
                                ? 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                                : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                            }`}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    User Details
                  </h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 dark:text-sky-400 font-bold text-xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.isActive)}`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedUser.lastLogin).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedUser.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {[
                          selectedUser.address.street,
                          selectedUser.address.city,
                          selectedUser.address.state,
                          selectedUser.address.zipCode,
                          selectedUser.address.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleToggleUserStatus(selectedUser._id, !selectedUser.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedUser.isActive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Users will appear here when they register
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;