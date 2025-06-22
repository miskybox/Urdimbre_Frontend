import axios from 'axios';
import { TokenStorage } from '../utils/TokenStorage.js';
import { TokenValidator } from '../utils/TokenValidator.js';
import authService from '../services/authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = TokenStorage.getAccessToken();

    if (token && TokenValidator.isValidJWT(token) && !TokenValidator.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const newToken = TokenStorage.getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiInstance(originalRequest);
      } catch (refreshError) {
        TokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  get: (url, config = {}) => apiInstance.get(url, config).then((res) => res.data),
  post: (url, data, config = {}) => apiInstance.post(url, data, config).then((res) => res.data),
  put: (url, data, config = {}) => apiInstance.put(url, data, config).then((res) => res.data),
  delete: (url, config = {}) => apiInstance.delete(url, config).then((res) => res.data),

  updateUserRoles: (userId, rolesArray) => {
    if (!Array.isArray(rolesArray)) {
      throw new Error('El parámetro roles debe ser un array');
    }

    return apiInstance
      .put(`/users/${userId}/roles`, { roles: rolesArray })
      .then((res) => res.data);
  },

  createDirectRequest: () =>
    axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    }),
};

export default api;
