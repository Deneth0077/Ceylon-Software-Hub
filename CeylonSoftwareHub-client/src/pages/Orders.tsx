import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Download, 
  Upload, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  FileText
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: { name: string; images: { url: string }[] };
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

const CLOUDINARY_CLOUD_NAME = 'portfolio-mern';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset'; // Must match your Cloudinary unsigned preset

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCloudinarySlipUpload = async (orderId: string, file: File) => {
    setUploadingSlip(orderId);
    setUploadProgress(0);
    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const response = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      const imageUrl = response.data.secure_url;
      // Send the Cloudinary URL to the backend
      await api.post(`/orders/${orderId}/payment-slip`, { url: imageUrl });
      toast.success('Payment slip uploaded successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload payment slip');
      console.error('Error uploading payment slip:', error);
    } finally {
      setUploadingSlip(null);
      setUploadProgress(0);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your orders and download your software
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                        {getStatusIcon(order.paymentStatus)}
                        <span>{order.paymentStatus}</span>
                      </span>
                      
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span>{order.orderStatus}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <img
                              src={item.product.images[0]?.url || `https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=100`}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantity: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            {order.paymentStatus === 'paid' && order.orderStatus === 'completed' && (
                              <button className="p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary & Actions */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          {order.paymentMethod === 'card' ? <CreditCard className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          <span>{order.paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}</span>
                        </div>
                      </div>

                      {/* Payment Slip Upload */}
                      {order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'pending' && !order.paymentSlip && (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              Upload your payment slip
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleCloudinarySlipUpload(order._id, file);
                                }
                              }}
                              className="hidden"
                              id={`upload-${order._id}`}
                            />
                            <label
                              htmlFor={`upload-${order._id}`}
                              className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              {uploadingSlip === order._id ? `Uploading... (${uploadProgress}%)` : 'Choose File'}
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Payment Slip Status */}
                      {order.paymentSlip && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 mb-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Payment slip uploaded</span>
                          </div>
                          <img src={order.paymentSlip.url} alt="Payment Slip" className="mt-2 rounded-lg w-40 h-28 object-cover border" />
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Uploaded on {new Date(order.paymentSlip.uploadedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Status: {order.paymentStatus === 'pending' ? 'Under review' : 'Verified'}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Order items, payment info, etc. */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Items</h4>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-300">{item.name} × {item.quantity}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;