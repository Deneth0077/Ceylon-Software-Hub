import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  DollarSign,
  User
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PaymentSlip {
  _id: string;
  orderNumber: string;
  user?: { name: string; email: string };
  guestInfo?: { name: string; email: string };
  totalAmount: number;
  paymentStatus: string;
  paymentSlip: {
    url: string;
    uploadedAt: string;
  };
  createdAt: string;
  notes?: string;
}

const PaymentSlips: React.FC = () => {
  const [orders, setOrders] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PaymentSlip | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    fetchPaymentSlips();
  }, [selectedStatus, currentPage]);

  const fetchPaymentSlips = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: selectedStatus
      });

      const response = await axios.get(`/api/admin/payment-slips?${params}`);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching payment slips:', error);
      toast.error('Failed to load payment slips');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: string, approved: boolean) => {
    try {
      await axios.put(`/api/admin/payment-slips/${orderId}/verify`, {
        approved,
        notes: verificationNotes
      });
      
      toast.success(`Payment ${approved ? 'approved' : 'rejected'} successfully`);
      setSelectedOrder(null);
      setVerificationNotes('');
      fetchPaymentSlips();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Slip Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Review and verify uploaded payment slips
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Approved</option>
              <option value="failed">Rejected</option>
            </select>

            <button
              onClick={() => {
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

        {/* Payment Slips Table */}
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uploaded
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
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white">
                              {order.user?.name || order.guestInfo?.name || 'Guest'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {order.user?.email || order.guestInfo?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'pending' && <Clock className="h-3 w-3" />}
                          {order.paymentStatus === 'paid' && <CheckCircle className="h-3 w-3" />}
                          {order.paymentStatus === 'failed' && <XCircle className="h-3 w-3" />}
                          <span>{order.paymentStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.paymentSlip.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          title="View Payment Slip"
                        >
                          <Eye className="h-4 w-4" />
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

        {/* Payment Slip Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Slip Verification - {selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Order Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Order Details</h4>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Order Number:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Customer:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedOrder.user?.name || selectedOrder.guestInfo?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Email:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedOrder.user?.email || selectedOrder.guestInfo?.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Uploaded:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedOrder.paymentSlip.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Verification Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification Notes
                      </label>
                      <textarea
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Add notes about the verification..."
                      />
                    </div>

                    {/* Action Buttons */}
                    {selectedOrder.paymentStatus === 'pending' && (
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleVerifyPayment(selectedOrder._id, true)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve Payment</span>
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(selectedOrder._id, false)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject Payment</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Slip Image */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Slip</h4>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={selectedOrder.paymentSlip.url}
                        alt="Payment Slip"
                        className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-700"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <a
                        href={selectedOrder.paymentSlip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-sm font-medium"
                      >
                        View Full Size
                      </a>
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
            <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No payment slips found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Payment slips will appear here when customers upload them
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSlips;