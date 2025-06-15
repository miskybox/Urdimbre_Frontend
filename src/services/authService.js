// src/services/authService.js - CLEAN CODE FINAL
import api from '../config/api.js';
import { TokenStorage } from '../utils/TokenStorage.js';
import { TokenValidator } from '../utils/TokenValidator.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

/**
 * 🔐 AuthService - Servicio de autenticación Clean Code
 * Responsabilidad única: Lógica de autenticación + manejo de errores amigables
 */
class AuthService {

  /**
   * Registra un nuevo usuario
   */
  async register(userData) {
    if (import.meta.env.DEV) {
      console.log('📝 Iniciando registro de usuario...');
    }
    
    try {
      // Limpiar tokens antes del registro
      TokenStorage.clearTokens();
      
      const response = await api.post('/auth/register', userData);
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuario registrado exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error en registro:', error.message);
      }
      
      // Limpiar tokens en caso de error
      TokenStorage.clearTokens();
      
      // Convertir error técnico a mensaje amigable
      const errorInfo = ErrorHandler.handleAuthError(error);
      
      // Crear error amigable para el usuario
      const friendlyError = new Error(errorInfo.userMessage);
      friendlyError.fieldErrors = errorInfo.fieldErrors;
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Inicia sesión del usuario
   */
  async login(credentials) {
    if (import.meta.env.DEV) {
      console.log('🔑 Iniciando login...');
    }
    
    try {
      // Limpiar tokens previos
      TokenStorage.clearTokens();
      
      const response = await api.post('/auth/login', credentials);
      
      // Validar respuesta
      if (!response.data.accessToken || !response.data.refreshToken) {
        throw new Error('Respuesta de login inválida: faltan tokens');
      }
      
      // Guardar tokens con validación automática
      TokenStorage.saveTokens(response.data.accessToken, response.data.refreshToken);
      
      if (import.meta.env.DEV) {
        console.log('✅ Login exitoso');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error en login:', error.message);
      }
      
      TokenStorage.clearTokens();
      
      // Convertir a error amigable
      const errorInfo = ErrorHandler.handleAuthError(error);
      
      const friendlyError = new Error(errorInfo.userMessage);
      friendlyError.fieldErrors = errorInfo.fieldErrors;
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Obtiene información del usuario actual
   */
  async getCurrentUser() {
    if (import.meta.env.DEV) {
      console.log('👤 Obteniendo usuario actual...');
    }
    
    try {
      // Verificar que hay tokens válidos
      if (!TokenStorage.hasValidTokens()) {
        throw new Error('No hay tokens válidos disponibles');
      }
      
      const response = await api.get('/users/me');
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuario obtenido exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error obteniendo usuario:', error.message);
      }
      
      // Si es error de autenticación, limpiar tokens
      if (ErrorHandler.shouldLogout(error)) {
        TokenStorage.clearTokens();
      }
      
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout() {
    if (import.meta.env.DEV) {
      console.log('🚪 Iniciando logout...');
    }
    
    try {
      // Intentar notificar al servidor (sin bloquear el logout)
      await api.post('/auth/logout').catch(error => {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Error notificando logout al servidor:', error.message);
        }
      });
      
    } finally {
      // Siempre limpiar tokens locales
      TokenStorage.clearTokens();
      
      if (import.meta.env.DEV) {
        console.log('✅ Logout completado');
      }
    }
  }

  /**
   * Refresca el access token manualmente
   * NOTA: Los interceptors de API ya manejan esto automáticamente
   */
  async refreshToken() {
    if (import.meta.env.DEV) {
      console.log('🔄 Refrescando tokens manualmente...');
    }
    
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (!refreshToken || !TokenValidator.isValidJWT(refreshToken) || TokenValidator.isTokenExpired(refreshToken)) {
        throw new Error('Refresh token inválido o expirado');
      }

      // Crear request directo (sin interceptors para evitar bucles)
      const directApi = api.createDirectRequest();
      const response = await directApi.post('/auth/refresh', { refreshToken });
      
      if (!response.data.accessToken || !response.data.refreshToken) {
        throw new Error('Respuesta de refresh inválida');
      }
      
      // Guardar nuevos tokens
      TokenStorage.saveTokens(response.data.accessToken, response.data.refreshToken);
      
      if (import.meta.env.DEV) {
        console.log('✅ Tokens refrescados exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error refrescando tokens:', error.message);
      }
      
      TokenStorage.clearTokens();
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated() {
    return TokenStorage.hasValidTokens();
  }

  /**
   * Valida un código de invitación en tiempo real
   */
  async validateInviteCode(code) {
    if (!code || code.trim().length < 3) {
      return { valid: false, message: 'Código muy corto' };
    }

    try {
      if (import.meta.env.DEV) {
        console.log('🔍 Validando código de invitación...');
      }
      
      const response = await api.get(`/auth/invite-codes/info?code=${encodeURIComponent(code)}`);
      
      return {
        valid: response.data.valid,
        message: response.data.message || (response.data.valid ? 'Código válido' : 'Código inválido')
      };
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error validando código:', error.message);
      }
      
      return {
        valid: false,
        message: 'Error al validar código. Verifica tu conexión.'
      };
    }
  }

  /**
   * Limpieza de emergencia completa
   */
  emergencyCleanup() {
    if (import.meta.env.DEV) {
      console.warn('🚨 Ejecutando limpieza de emergencia desde AuthService...');
    }
    
    TokenStorage.emergencyCleanup();
  }
}

// Instancia única
const authService = new AuthService();

// Utilidades de desarrollo
if (import.meta.env.DEV) {
  window.authService = authService;
  window.emergencyAuthCleanup = () => authService.emergencyCleanup();
  
  console.log('🔧 AuthService Clean - Utilidades de desarrollo:');
  console.log('   • window.authService - Acceso directo al servicio');
  console.log('   • window.emergencyAuthCleanup() - Limpieza de emergencia');
}

export default authService;