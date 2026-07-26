import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: attach auth token from localStorage (if exists)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    if (error.response) {
      // Server responded with a status outside 2xx
      const { status, data } = error.response;
      // You can customize error handling based on status
      if (status === 401) {
        // Unauthorized - maybe redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          // Optionally redirect to login page
          window.location.href = '/login';
        }
      }
      // You can throw a custom error or reject with original error
      return Promise.reject({ status, data, ...error });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network error - please try again later'));
    } else {
      // Something else
      return Promise.reject(new Error(error.message));
    }
  }
);

export default apiClient;