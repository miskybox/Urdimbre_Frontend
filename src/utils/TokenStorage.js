
import { TokenValidator } from './TokenValidator.js';


export class TokenStorage {
  
  static TOKEN_KEY = 'token';
  static REFRESH_TOKEN_KEY = 'refreshToken';
  static CLEANUP_INTERVAL = null;

  
  static getAccessToken() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      
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

 
  static getRefreshToken() {
    try {
      const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
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


  static saveTokens(accessToken, refreshToken) {
  
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
      
      this.#startAutoCleanup();
      
    } catch (error) {
      throw new Error(`Error guardando tokens: ${error.message}`);
    }
  }

 
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
          
          this.#stopAutoCleanup();
          break;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error limpiando tokens:', error);
      }
    }
  }

  static hasValidTokens() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    const hasValid = Boolean(
      accessToken && 
      refreshToken && 
      TokenValidator.isValidJWT(accessToken) && 
      TokenValidator.isValidJWT(refreshToken) &&
      !TokenValidator.isTokenExpired(refreshToken) 
    );
    
    return hasValid;
  }


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

 
  static emergencyCleanup() {
    if (import.meta.env.DEV) {
      console.warn('🚨 Ejecutando limpieza de emergencia...');
    }
    
    try {
      
      const theme = localStorage.getItem('theme');
      const language = localStorage.getItem('language');
      const preferences = localStorage.getItem('userPreferences');
      
     
      this.clearTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      
   
      if (theme) localStorage.setItem('theme', theme);
      if (language) localStorage.setItem('language', language);
      if (preferences) localStorage.setItem('userPreferences', preferences);
      

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
     
      if (import.meta.env.DEV) {
        console.error('Error en limpieza de emergencia:', error);
      }
      window.location.reload();
    }
  }

  
  static #startAutoCleanup() {
    if (this.CLEANUP_INTERVAL) return; 

    this.cleanupExpiredTokens();

    this.CLEANUP_INTERVAL = setInterval(() => {
      this.cleanupExpiredTokens();
    }, 5 * 60 * 1000);
    
    if (import.meta.env.DEV) {
      console.log('🔄 Auto-limpieza de tokens iniciada (cada 5 min)');
    }
  }

  
  static #stopAutoCleanup() {
    if (this.CLEANUP_INTERVAL) {
      clearInterval(this.CLEANUP_INTERVAL);
      this.CLEANUP_INTERVAL = null;
      
      if (import.meta.env.DEV) {
        console.log('🔄 Auto-limpieza de tokens detenida');
      }
    }
  }

  
  static init() {
    
    this.cleanupExpiredTokens();
    
    
    if (this.hasValidTokens()) {
      this.#startAutoCleanup();
    }
    

    window.addEventListener('beforeunload', () => {
      this.cleanupExpiredTokens();
    });
    
    if (import.meta.env.DEV) {
      console.log('🔧 TokenStorage inicializado');
   
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


TokenStorage.init();