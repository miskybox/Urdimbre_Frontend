import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // ✅ TIMEOUT PARA EVITAR REQUESTS COLGADOS
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERCEPTOR DE REQUEST - AÑADIR TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // ✅ LOG PARA DEBUG
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, 
      config.data ? { data: config.data } : '');
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// ✅ INTERCEPTOR DE RESPONSE - MANEJAR 401 Y REFRESH TOKEN
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);

    // ✅ SI ES 401 Y NO HEMOS REINTENTADO AÚN
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('🔄 Token expirado, intentando renovar...');
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          throw new Error("No hay refresh token disponible");
        }

        // ✅ LLAMADA DIRECTA (SIN INTERCEPTOR) PARA EVITAR BUCLES
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // ✅ REINTENTAR REQUEST ORIGINAL CON NUEVO TOKEN
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        console.log('✅ Token renovado, reintentando request original');
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Error al renovar token:', refreshError);
        
        // ✅ LIMPIAR TOKENS Y REDIRIGIR AL LOGIN
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        
        // ✅ SOLO REDIRIGIR SI NO ESTAMOS YA EN LOGIN/REGISTER
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;