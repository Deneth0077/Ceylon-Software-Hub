import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import About from './pages/About';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import PaymentSlips from './pages/admin/PaymentSlips';
import AddProduct from './pages/admin/AddProduct';

// Protected Route component
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  // Debug logging
  console.log('Google Client ID:', googleClientId);
  console.log('All environment variables:', import.meta.env);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Protected Routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products/add" element={
                    <AdminRoute>
                      <AddProduct />
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  } />
                  <Route path="/admin/payment-slips" element={
                    <AdminRoute>
                      <PaymentSlips />
                    </AdminRoute>
                  } />
                </Routes>
              </main>
              <Footer />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#323232',
                    color: '#fff',
                  },
                  className: 'dark:bg-gray-800 dark:text-white',
                }}
              />
            </div>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;