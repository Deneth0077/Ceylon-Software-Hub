import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Debug logging
  console.log('Login component loaded');
  console.log('Google Client ID from env:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.emailOrPhone, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google OAuth Success:', credentialResponse);
    try {
      // Error is handled in AuthContext
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  required
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10"
                  placeholder="Enter your email or phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
              >
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;