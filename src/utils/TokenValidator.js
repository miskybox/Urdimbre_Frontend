// src/utils/TokenValidator.js - VERSIÓN PRODUCCIÓN
/**
 * 🔍 TokenValidator - Validación de tokens JWT
 * Responsabilidad única: Solo validar tokens (sin side effects)
 */
export class TokenValidator {
  
  /**
   * Valida si un string tiene formato JWT válido
   */
  static isValidJWT(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Verificar que se puede decodificar el payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Verificar campos mínimos requeridos
      return Boolean(payload.sub && payload.exp && payload.iat);
      
    } catch (error) {
      // En producción, no mostrar errores de validación
      if (import.meta.env.DEV) {
        console.warn('Error validando JWT:', error.message);
      }
      return false;
    }
  }

  /**
   * Verifica si un token JWT está expirado
   */
  static isTokenExpired(token) {
    if (!this.isValidJWT(token)) {
      return true;
    }

    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      // exp está en segundos, Date.now() en milisegundos
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (import.meta.env.DEV && isExpired) {
        console.warn('Token expirado:', new Date(payload.exp * 1000));
      }
      
      return isExpired;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error verificando expiración:', error.message);
      }
      return true;
    }
  }

  /**
   * Extrae el payload de un token JWT
   */
  static getTokenPayload(token) {
    if (!this.isValidJWT(token)) {
      return null;
    }

    try {
      const parts = token.split('.');
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error extrayendo payload:', error.message);
      }
      return null;
    }
  }

  /**
   * Obtiene el tiempo restante de un token en milisegundos
   */
  static getTimeToExpiry(token) {
    const payload = this.getTokenPayload(token);
    if (!payload) return 0;
    
    return Math.max(0, (payload.exp * 1000) - Date.now());
  }

  /**
   * Verifica si un token expira pronto (en los próximos 5 minutos)
   */
  static willExpireSoon(token, minutesThreshold = 5) {
    const timeToExpiry = this.getTimeToExpiry(token);
    return timeToExpiry > 0 && timeToExpiry < (minutesThreshold * 60 * 1000);
  }
}