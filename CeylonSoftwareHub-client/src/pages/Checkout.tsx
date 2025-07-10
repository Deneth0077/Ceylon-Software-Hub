import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Upload, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for buyNowItem in navigation state
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = Boolean(buyNowItem);

  // For Buy Now, use the single item and its price
  const checkoutItems = isBuyNow ? [buyNowItem] : items;
  const checkoutTotal = isBuyNow ? buyNowItem.price : total;

  // Only redirect if there are no items (for cart checkout)
  if (!isBuyNow && items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    fullAddress: user?.address ? [user.address.street, user.address.city, user.address.state, user.address.zipCode, user.address.country].filter(Boolean).join(', ') : '',
    phone1: user?.phone || '',
    phone2: '',
    email: user?.email || '',
  });

  // Auto-update customer info if user changes (e.g., after login)
  useEffect(() => {
    setCustomerInfo((prev) => ({
      ...prev,
      name: user?.name || '',
      fullAddress: user?.address ? [user.address.street, user.address.city, user.address.state, user.address.zipCode, user.address.country].filter(Boolean).join(', ') : '',
      phone1: user?.phone || '',
      email: user?.email || '',
    }));
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');
  const [loading, setLoading] = useState(false);
  const [showSlipUpload, setShowSlipUpload] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipUploadProgress, setSlipUploadProgress] = useState(0);
  const [slipUrl, setSlipUrl] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: checkoutItems.map(item => ({
          productId: item._id,
          quantity: item.quantity || 1
        })),
        paymentMethod,
        customerInfo
      };

      const response = await api.post('/api/orders', orderData);
      const order = response.data.order;

      if (paymentMethod === 'card') {
        // Redirect to Stripe payment
        const paymentResponse = await api.post('/payments/create-payment-intent', {
          orderId: order._id
        });
        
        // In a real app, you would integrate with Stripe Elements here
        toast.success('Order created! Redirecting to payment...');
        navigate(`/orders`);
      } else {
        // Bank transfer - show slip upload section
        setShowSlipUpload(true);
        setNewOrderId(order._id);
        toast.success('Order created! Please upload your payment slip.');
      }

      clearCart();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Cloudinary upload handler for payment slip
  const handleCloudinarySlipUpload = async (file: File) => {
    if (!newOrderId) return;
    setSlipUploading(true);
    setSlipUploadProgress(0);
    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const response = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setSlipUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      const imageUrl = response.data.secure_url;
      setSlipUrl(imageUrl);
      // Send the Cloudinary URL to the backend
      await api.post(`/api/orders/${newOrderId}/payment-slip`, { url: imageUrl });
      toast.success('Payment slip uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload payment slip');
      console.error('Error uploading payment slip:', error);
    } finally {
      setSlipUploading(false);
      setSlipUploadProgress(0);
    }
  };

  // Compose WhatsApp message with user and product details
  const productName = checkoutItems && checkoutItems.length > 0 ? checkoutItems[0].name : '';
  const whatsappMessage = encodeURIComponent(
    `Hello, I am sending my payment slip for my order.\nName: ${customerInfo.name}\nEmail: ${customerInfo.email}\nProduct: ${productName}`
  );

  return (
    <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Complete your purchase securely
          </p>
        </div>

        {/* Slip Upload Section for Bank Transfer */}
        {showSlipUpload && newOrderId && (
          <div className="p-6 mb-8 bg-blue-50 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
            <div className="mb-4 p-4 border-2 border-dashed border-sky-400 bg-white dark:bg-gray-800 rounded-lg flex flex-col items-center">
              <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mb-2">Upload Payment Slip (Image or PDF)</h3>
              <a
                href={`https://wa.me/94776309128?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 mb-2 text-base font-semibold text-white bg-sky-600 rounded-lg transition-colors cursor-pointer hover:bg-sky-700"
              >
                Upload Slip (Image or PDF)
              </a>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">Click the button above to send your payment slip via WhatsApp.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Customer Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullAddress}
                    onChange={e => setCustomerInfo({ ...customerInfo, fullAddress: e.target.value })}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number 1
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone1}
                    onChange={e => setCustomerInfo({ ...customerInfo, phone1: e.target.value })}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number 2
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone2}
                    onChange={e => setCustomerInfo({ ...customerInfo, phone2: e.target.value })}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Payment Method
              </h3>
              
              <div className="space-y-4">
                {/* Credit Card Option */}
                <label className="flex items-center p-4 space-x-3 rounded-lg border border-gray-200 transition-colors cursor-pointer dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay securely with Stripe</p>
                  </div>
                </label>

                {/* Bank Transfer Option */}
                <label className="flex items-center p-4 space-x-3 rounded-lg border border-gray-200 transition-colors cursor-pointer dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Bank Transfer</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload payment slip for verification</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 mt-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-400">
                    Bank Transfer Details
                  </h4>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                    <p><strong>Bank:</strong> Ceylon Commercial Bank</p>
                    <p><strong>Account Name:</strong> Ceylon Software Hub</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>Swift Code:</strong> CCEYLKLX</p>
                  </div>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    After payment, you'll be able to upload your payment slip for verification.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-center lg:col-span-1">
            <div className="sticky top-8 p-6 w-full max-w-md h-[350px] overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h3>
             
              <div className="mb-6 space-y-3">
                {checkoutItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {item.name} × {item.quantity || 1}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatCurrency(checkoutTotal)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex justify-center items-center px-6 py-3 space-x-2 w-full font-semibold text-white bg-sky-600 rounded-lg transition-colors hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Complete Order</span>
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex justify-center items-center mt-6 space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;