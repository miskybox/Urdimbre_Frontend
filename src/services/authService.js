// src/services/authService.js
import api from '../config/api.js';
import { TokenStorage } from '../utils/TokenStorage.js';
import { TokenValidator } from '../utils/TokenValidator.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

class AuthService {
  async register(userData) {
    TokenStorage.clearTokens();
    try {
      const data = await api.post('/auth/register', userData);
      return data;
    } catch (error) {
      TokenStorage.clearTokens();
      const errorInfo = ErrorHandler.handleAuthError(error);
      const friendlyError = new Error(errorInfo.userMessage);
      friendlyError.fieldErrors = errorInfo.fieldErrors;
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async login(credentials) {
    TokenStorage.clearTokens();
    try {
      const data = await api.post('/auth/login', credentials);
      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Respuesta de login inválida: faltan tokens');
      }
      TokenStorage.saveTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      TokenStorage.clearTokens();
      const errorInfo = ErrorHandler.handleAuthError(error);
      const friendlyError = new Error(errorInfo.userMessage);
      friendlyError.fieldErrors = errorInfo.fieldErrors;
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async getCurrentUser() {
    try {
      if (!TokenStorage.hasValidTokens()) {
        throw new Error('No hay tokens válidos disponibles');
      }
      const data = await api.get('/users/me');
      return data;
    } catch (error) {
      if (ErrorHandler.shouldLogout(error)) {
        TokenStorage.clearTokens();
      }
      throw error;
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout').catch(() => {});
    } finally {
      TokenStorage.clearTokens();
    }
  }

  async refreshToken() {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken || !TokenValidator.isValidJWT(refreshToken) || TokenValidator.isTokenExpired(refreshToken)) {
        throw new Error('Refresh token inválido o expirado');
      }
      const directApi = api.createDirectRequest();
      const data = await directApi.post('/auth/refresh', { refreshToken });
      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Respuesta de refresh inválida');
      }
      TokenStorage.saveTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      TokenStorage.clearTokens();
      throw error;
    }
  }

  isAuthenticated() {
    return TokenStorage.hasValidTokens();
  }

  async validateInviteCode(code) {
    if (!code || code.trim().length < 3) {
      return { valid: false, message: 'Código muy corto' };
    }

    try {
      const data = await api.get(`/auth/invite-codes/info?code=${encodeURIComponent(code)}`);
      return {
        valid: data.valid,
        message: data.message || (data.valid ? 'Código válido' : 'Código inválido'),
      };
    } catch {
      return {
        valid: false,
        message: 'Error al validar código. Verifica tu conexión.',
      };
    }
  }

  emergencyCleanup() {
    TokenStorage.emergencyCleanup();
  }
}

const authService = new AuthService();

if (import.meta.env.DEV) {
  window.authService = authService;
  window.emergencyAuthCleanup = () => authService.emergencyCleanup();
  console.log('🔧 AuthService disponible como window.authService');
}

export default authService;
