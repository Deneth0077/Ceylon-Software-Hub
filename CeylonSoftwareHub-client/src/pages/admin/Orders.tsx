import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  user?: { name: string; email: string };
  guestInfo?: { name: string; email: string };
  items: Array<{
    product: { name: string };
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  paymentSlip?: { url: string; uploadedAt: string };
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, selectedStatus, selectedPaymentStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus
      });

      const response = await axios.get(`/api/admin/orders?${params}`);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const updateData: any = { orderStatus };
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      await axios.put(`/api/admin/orders/${orderId}/status`, updateData);
      toast.success('Order updated successfully');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`/api/orders/${orderId}`);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage customer orders and track their status
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by order number..."
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
              <option value="all">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedPaymentStatus('all');
                setCurrentPage(1);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
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
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item(s)
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {order.user?.name || order.guestInfo?.name || 'Guest'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.user?.email || order.guestInfo?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                          {getStatusIcon(order.paymentStatus)}
                          <span>{order.paymentStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Details - {selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Customer Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">Name:</span> {selectedOrder.user?.name || selectedOrder.guestInfo?.name}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">Email:</span> {selectedOrder.user?.email || selectedOrder.guestInfo?.email}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                      <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Slip */}
                {selectedOrder.paymentSlip && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment Slip</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <img
                        src={selectedOrder.paymentSlip.url}
                        alt="Payment Slip"
                        className="max-w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Uploaded: {new Date(selectedOrder.paymentSlip.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Update Status</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Order Status</label>
                      <select
                        value={selectedOrder.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
                      <select
                        value={selectedOrder.paymentStatus}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, selectedOrder.orderStatus, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Orders will appear here when customers make purchases
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;