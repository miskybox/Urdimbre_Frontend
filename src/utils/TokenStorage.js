// src/utils/TokenStorage.js - CON LIMPIEZA AUTOMÁTICA INTEGRADA
import { TokenValidator } from './TokenValidator.js';

/**
 * 💾 TokenStorage - Gestión de almacenamiento + limpieza automática
 * Responsabilidad: localStorage + validación + auto-limpieza
 */
export class TokenStorage {
  
  static TOKEN_KEY = 'token';
  static REFRESH_TOKEN_KEY = 'refreshToken';
  static CLEANUP_INTERVAL = null;

  /**
   * Obtiene el access token
   */
  static getAccessToken() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      
      // Auto-limpieza: Si el token es inválido, removerlo automáticamente
      if (token && !TokenValidator.isValidJWT(token)) {
        if (import.meta.env.DEV) {
          console.warn('🧹 Access token inválido detectado, removiendo...');
        }
        this.clearTokens('access');
        return null;
      }
      
      return token;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error obteniendo access token:', error);
      }
      return null;
    }
  }

  /**
   * Obtiene el refresh token
   */
  static getRefreshToken() {
    try {
      const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      // Auto-limpieza: Si el token es inválido, removerlo automáticamente
      if (token && !TokenValidator.isValidJWT(token)) {
        if (import.meta.env.DEV) {
          console.warn('🧹 Refresh token inválido detectado, removiendo...');
        }
        this.clearTokens('refresh');
        return null;
      }
      
      return token;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error obteniendo refresh token:', error);
      }
      return null;
    }
  }

  /**
   * Guarda tokens con validación automática
   */
  static saveTokens(accessToken, refreshToken) {
    // Validación estricta antes de guardar
    if (!TokenValidator.isValidJWT(accessToken)) {
      throw new Error('Access token inválido');
    }
    
    if (!TokenValidator.isValidJWT(refreshToken)) {
      throw new Error('Refresh token inválido');
    }

    try {
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      
      if (import.meta.env.DEV) {
        console.log('✅ Tokens guardados correctamente');
      }
      
      // Iniciar limpieza automática si no está activa
      this.#startAutoCleanup();
      
    } catch (error) {
      throw new Error(`Error guardando tokens: ${error.message}`);
    }
  }

  /**
   * Limpia tokens según el tipo especificado
   */
  static clearTokens(tokenType = 'both') {
    try {
      switch (tokenType) {
        case 'access':
          localStorage.removeItem(this.TOKEN_KEY);
          if (import.meta.env.DEV) {
            console.log('🧹 Access token limpiado');
          }
          break;
        case 'refresh':
          localStorage.removeItem(this.REFRESH_TOKEN_KEY);
          if (import.meta.env.DEV) {
            console.log('🧹 Refresh token limpiado');
          }
          break;
        case 'both':
        default:
          localStorage.removeItem(this.TOKEN_KEY);
          localStorage.removeItem(this.REFRESH_TOKEN_KEY);
          if (import.meta.env.DEV) {
            console.log('🧹 Todos los tokens limpiados');
          }
          
          // Detener limpieza automática si no hay tokens
          this.#stopAutoCleanup();
          break;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error limpiando tokens:', error);
      }
    }
  }

  /**
   * Verifica si hay tokens válidos disponibles
   */
  static hasValidTokens() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    const hasValid = Boolean(
      accessToken && 
      refreshToken && 
      TokenValidator.isValidJWT(accessToken) && 
      TokenValidator.isValidJWT(refreshToken) &&
      !TokenValidator.isTokenExpired(refreshToken) // Al menos refresh token debe estar vigente
    );
    
    return hasValid;
  }

  /**
   * Limpia tokens expirados automáticamente
   */
  static cleanupExpiredTokens() {
    let cleanedAny = false;
    
    const accessToken = this.getAccessToken();
    if (accessToken && TokenValidator.isTokenExpired(accessToken)) {
      this.clearTokens('access');
      cleanedAny = true;
      if (import.meta.env.DEV) {
        console.log('🧹 Access token expirado removido');
      }
    }
    
    const refreshToken = this.getRefreshToken();
    if (refreshToken && TokenValidator.isTokenExpired(refreshToken)) {
      this.clearTokens('refresh');
      cleanedAny = true;
      if (import.meta.env.DEV) {
        console.log('🧹 Refresh token expirado removido');
      }
    }
    
    return cleanedAny;
  }

  /**
   * Limpieza de emergencia - remueve todo y redirige
   */
  static emergencyCleanup() {
    if (import.meta.env.DEV) {
      console.warn('🚨 Ejecutando limpieza de emergencia...');
    }
    
    try {
      // Preservar configuraciones del usuario
      const theme = localStorage.getItem('theme');
      const language = localStorage.getItem('language');
      const preferences = localStorage.getItem('userPreferences');
      
      // Limpiar tokens y datos de sesión
      this.clearTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      
      // Restaurar configuraciones
      if (theme) localStorage.setItem('theme', theme);
      if (language) localStorage.setItem('language', language);
      if (preferences) localStorage.setItem('userPreferences', preferences);
      
      // Redirigir solo si no estamos en páginas públicas
      const publicPaths = ['/login', '/register', '/', '/terms', '/privacy'];
      if (!publicPaths.includes(window.location.pathname)) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
      
      if (import.meta.env.DEV) {
        console.log('✅ Limpieza de emergencia completada');
      }
      
    } catch (error) {
      // Fallback: recargar página si hay errores
      if (import.meta.env.DEV) {
        console.error('Error en limpieza de emergencia:', error);
      }
      window.location.reload();
    }
  }

  /**
   * Inicia limpieza automática periódica
   */
  static #startAutoCleanup() {
    if (this.CLEANUP_INTERVAL) return; // Ya está activo
    
    // Limpieza inicial
    this.cleanupExpiredTokens();
    
    // Limpieza cada 5 minutos
    this.CLEANUP_INTERVAL = setInterval(() => {
      this.cleanupExpiredTokens();
    }, 5 * 60 * 1000);
    
    if (import.meta.env.DEV) {
      console.log('🔄 Auto-limpieza de tokens iniciada (cada 5 min)');
    }
  }

  /**
   * Detiene limpieza automática
   */
  static #stopAutoCleanup() {
    if (this.CLEANUP_INTERVAL) {
      clearInterval(this.CLEANUP_INTERVAL);
      this.CLEANUP_INTERVAL = null;
      
      if (import.meta.env.DEV) {
        console.log('🔄 Auto-limpieza de tokens detenida');
      }
    }
  }

  /**
   * Inicialización automática al cargar la página
   */
  static init() {
    // Limpieza inicial
    this.cleanupExpiredTokens();
    
    // Iniciar auto-limpieza si hay tokens
    if (this.hasValidTokens()) {
      this.#startAutoCleanup();
    }
    
    // Limpiar al cerrar la pestaña
    window.addEventListener('beforeunload', () => {
      this.cleanupExpiredTokens();
    });
    
    if (import.meta.env.DEV) {
      console.log('🔧 TokenStorage inicializado');
      
      // Utilidades de desarrollo
      window.tokenStorage = {
        show: () => {
          console.group('🔍 Estado de tokens:');
          console.log('Access Token:', this.getAccessToken() ? 'Presente' : 'Ausente');
          console.log('Refresh Token:', this.getRefreshToken() ? 'Presente' : 'Ausente');
          console.log('¿Válidos?', this.hasValidTokens());
          console.groupEnd();
        },
        cleanup: () => this.emergencyCleanup(),
        clear: () => this.clearTokens()
      };
      
      console.log('🔧 Utilidades dev: window.tokenStorage.show(), .cleanup(), .clear()');
    }
  }
}

// Auto-inicialización
TokenStorage.init();