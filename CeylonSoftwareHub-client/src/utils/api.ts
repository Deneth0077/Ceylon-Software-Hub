import axios from 'axios';

// For a two-repository setup, VITE_API_URL must be the full URL of the deployed backend.
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error(
    'VITE_API_URL is not set. This is required for the frontend to connect to the backend. ' +
    'Set it in your .env file for local development, and in Vercel project settings for deployed environments. ' +
    'It should be the full URL of your backend (e.g., https://your-backend.vercel.app/api).'
  );
}

const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.request.use(config => {
  const fullUrl = (config.baseURL || '') + (config.url || '');
  console.log('[API DEBUG] Requesting:', fullUrl);
  return config;
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isCloudinary = config.url && config.url.includes('cloudinary.com');

    // Only add Authorization header if it's not a Cloudinary request
    if (token && !isCloudinary) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (isCloudinary) {
      // Ensure no Authorization header for Cloudinary
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Consider making this path configurable or using React Router's navigate
      } else {
        console.error('localStorage is not available. Cannot redirect on 401.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;