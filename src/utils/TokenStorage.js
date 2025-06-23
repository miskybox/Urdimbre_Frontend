import { TokenValidator } from './TokenValidator.js';

export class TokenStorage {
  static TOKEN_KEY = 'token';
  static REFRESH_TOKEN_KEY = 'refreshToken';
  static CLEANUP_INTERVAL = null;

  static getAccessToken() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token && !TokenValidator.isValidJWT(token)) {
        this.clearTokens('access');
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }

  static getRefreshToken() {
    try {
      const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (token && !TokenValidator.isValidJWT(token)) {
        this.clearTokens('refresh');
        return null;
      }
      return token;
    } catch {
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
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this.#startAutoCleanup();
  }

  static clearTokens(tokenType = 'both') {
    switch (tokenType) {
      case 'access':
        localStorage.removeItem(this.TOKEN_KEY);
        break;
      case 'refresh':
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        break;
      case 'both':
      default:
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        this.#stopAutoCleanup();
        break;
    }
  }

  static hasValidTokens() {
    const accessToken  = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return Boolean(
      accessToken &&
      refreshToken &&
      TokenValidator.isValidJWT(accessToken) &&
      TokenValidator.isValidJWT(refreshToken) &&
      !TokenValidator.isTokenExpired(refreshToken)
    );
  }

  static cleanupExpiredTokens() {
    let cleanedAny = false;
    const accessToken  = this.getAccessToken();
    if (accessToken && TokenValidator.isTokenExpired(accessToken)) {
      this.clearTokens('access');
      cleanedAny = true;
    }
    const refreshToken = this.getRefreshToken();
    if (refreshToken && TokenValidator.isTokenExpired(refreshToken)) {
      this.clearTokens('refresh');
      cleanedAny = true;
    }
    return cleanedAny;
  }

  static emergencyCleanup() {
    const theme       = localStorage.getItem('theme');
    const language    = localStorage.getItem('language');
    const preferences = localStorage.getItem('userPreferences');

    this.clearTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');

    if (theme)       localStorage.setItem('theme', theme);
    if (language)    localStorage.setItem('language', language);
    if (preferences) localStorage.setItem('userPreferences', preferences);

    const publicPaths = ['/login', '/register', '/', '/terms', '/privacy'];
    if (!publicPaths.includes(window.location.pathname)) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
  }

  static #startAutoCleanup() {
    if (this.CLEANUP_INTERVAL) return;
    this.cleanupExpiredTokens();
    this.CLEANUP_INTERVAL = setInterval(() => {
      this.cleanupExpiredTokens();
    }, 5 * 60 * 1000);
  }

  static #stopAutoCleanup() {
    if (!this.CLEANUP_INTERVAL) return;
    clearInterval(this.CLEANUP_INTERVAL);
    this.CLEANUP_INTERVAL = null;
  }

  static init() {
    this.cleanupExpiredTokens();
    if (this.hasValidTokens()) {
      this.#startAutoCleanup();
    }
    window.addEventListener('beforeunload', () => {
      this.cleanupExpiredTokens();
    });
  }
}

TokenStorage.init();
