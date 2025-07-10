import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://ceylon-software-hub-server.vercel.app';
if (!baseURL) {
  throw new Error('VITE_API_URL is not set!');
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
    if (token && !(config.url && config.url.includes('cloudinary.com'))) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.url && config.url.includes('cloudinary.com')) {
      if (config.headers && config.headers.Authorization) {
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;