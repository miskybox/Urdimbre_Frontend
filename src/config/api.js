
import axios from "axios";
import { TokenStorage } from '../utils/TokenStorage.js';
import { TokenValidator } from '../utils/TokenValidator.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    
    const token = TokenStorage.getAccessToken();
    

    if (token && TokenValidator.isValidJWT(token) && !TokenValidator.isTokenExpired(token)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    

    if (import.meta.env.DEV) {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, 
        config.data ? { data: config.data } : '');
    }
    
    return config;
  },
  (error) => {
    
    if (import.meta.env.DEV) {
      console.error('❌ Request interceptor error:', error);
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);


api.interceptors.response.use(
  (response) => {
   
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);
    }

    if (shouldAttemptTokenRefresh(error, originalRequest)) {
      originalRequest._retry = true;
      try {
        const accessToken = await attemptTokenRefresh();
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        if (import.meta.env.DEV) {
          console.log('✅ Token renovado, reintentando request original');
        }
        return api(originalRequest);
      } catch (refreshError) {
        handleRefreshError(refreshError);
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);


function shouldAttemptTokenRefresh(error, originalRequest) {
  return error.response?.status === 401 && !originalRequest._retry;
}


async function attemptTokenRefresh() {
  if (import.meta.env.DEV) {
    console.log('🔄 Token expirado, intentando renovar...');
  }
  const refreshToken = TokenStorage.getRefreshToken();
  if (!refreshToken || !TokenValidator.isValidJWT(refreshToken) || TokenValidator.isTokenExpired(refreshToken)) {
    throw new Error("No hay refresh token válido disponible");
  }
  const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  if (!TokenValidator.isValidJWT(accessToken) || !TokenValidator.isValidJWT(newRefreshToken)) {
    throw new Error("Tokens recibidos son inválidos");
  }
  TokenStorage.saveTokens(accessToken, newRefreshToken);
  return accessToken;
}


function handleRefreshError(refreshError) {
  if (import.meta.env.DEV) {
    console.error('❌ Error al renovar token:', refreshError);
  }
  TokenStorage.clearTokens();
  const publicPaths = ['/login', '/register', '/', '/terms', '/privacy'];
  if (!publicPaths.includes(window.location.pathname)) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  }
}


api.createDirectRequest = (config) => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    ...config
  });
};


if (import.meta.env.DEV) {
  window.api = api;
  window.apiConfig = {
    baseURL: BASE_URL,
    timeout: 10000
  };
  
  console.log('🔧 API Client - Utilidades de desarrollo:');
  console.log('   • window.api - Instancia de Axios');
  console.log('   • window.apiConfig - Configuración actual');
}

export default api;