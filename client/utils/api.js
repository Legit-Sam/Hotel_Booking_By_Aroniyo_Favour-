import axios from 'axios';

// 1. Create Axios instance
const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',// Replace with your backend URL
  withCredentials: true, // For sending cookies (JWT)
});

// 2. Request interceptor (add token to headers)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Optional: Fallback to localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired? Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;