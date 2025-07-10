import axios from 'axios';

// Determine the base URL based on the environment
let baseURL;
if (import.meta.env.PROD) {
  // In production, Vercel rewrites will handle routing /api to the backend
  baseURL = '/api';
} else {
  // In development, use the VITE_API_URL from .env or a default local URL
  baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
}

if (!baseURL) {
  // This case should ideally not be reached if defaults are set
  throw new Error('API baseURL is not set! Check VITE_API_URL environment variable for development.');
}

const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.request.use(config => {
  // Ensure the full URL is logged correctly, especially for relative baseURL in production
  let fullUrl = config.url || '';
  if (config.baseURL && !fullUrl.startsWith('http')) {
    fullUrl = config.baseURL + (fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`);
  }
  console.log('[API DEBUG] Requesting:', fullUrl);
  return config;
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Ensure that the Authorization header is not added to Cloudinary requests
    // and that baseURL is correctly handled for relative paths
    const isCloudinary = config.url && config.url.includes('cloudinary.com');
    const isApiRequest = config.url && (config.url.startsWith('/') || config.url.startsWith(baseURL as string));

    if (token && !isCloudinary && isApiRequest) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (isCloudinary) {
      // Ensure no Authorization header for Cloudinary, even if it was somehow set
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
      // Check if 'localStorage' is available (it isn't in SSR contexts, though less likely for Vite SPA)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('localStorage is not available. Cannot redirect on 401.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
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