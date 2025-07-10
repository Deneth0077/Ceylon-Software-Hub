import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (items.length === 0) {
    return (
      <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto mb-6 w-24 h-24 text-gray-400 dark:text-gray-600" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Your cart is empty
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Looks like you haven't added any software to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 space-x-2 font-semibold text-white bg-sky-600 rounded-lg transition-colors hover:bg-sky-700"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-1">
            {items.map((item) => (
              <div
                key={item._id}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || `https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=200`}
                    alt={item.name}
                    className="object-cover w-20 h-20 rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="font-medium text-sky-600 dark:text-sky-400">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 text-gray-600 bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 font-medium text-center text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 text-gray-600 bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="mt-1 text-red-600 transition-colors dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-red-600 transition-colors dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Clear all items
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-100 lg:col-span-1">
            <div className="sticky top-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h3>
              
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Processing Fee</span>
                  <span>Free</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="flex justify-center items-center px-6 py-3 space-x-2 w-full font-semibold text-white bg-sky-600 rounded-lg transition-colors hover:bg-sky-700"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/products"
                className="flex justify-center items-center px-6 py-3 mt-3 w-full font-medium text-gray-700 rounded-lg border border-gray-300 transition-colors dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="p-4 mt-6 bg-green-50 rounded-lg dark:bg-green-900/20">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  Your payment information is protected with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;