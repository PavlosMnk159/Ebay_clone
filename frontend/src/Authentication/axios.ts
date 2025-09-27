import axios from 'axios';
import { BASE_URL } from '@/config/url';

const fetch_with_auth = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

fetch_with_auth.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

fetch_with_auth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const response = await axios.post('/token/refresh/', {
          refresh,
        });

        const newAccess = response.data.access;
        localStorage.setItem('access_token', newAccess);
        fetch_with_auth.defaults.headers['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return fetch_with_auth(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default fetch_with_auth;