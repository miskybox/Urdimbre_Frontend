
export class TokenValidator {
  
  
  static isValidJWT(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      
     
      return Boolean(payload.sub && payload.exp && payload.iat);
      
    } catch (error) {
  
      if (import.meta.env.DEV) {
        
      }
      return false;
    }
  }

  
  static isTokenExpired(token) {
    if (!this.isValidJWT(token)) {
      return true;
    }

    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
     
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (import.meta.env.DEV && isExpired) {
       
      }
      
      return isExpired;
      
    } catch (error) {
      if (import.meta.env.DEV) {
       
      }
      return true;
    }
  }

  
  static getTokenPayload(token) {
    if (!this.isValidJWT(token)) {
      return null;
    }

    try {
      const parts = token.split('.');
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      if (import.meta.env.DEV) {
       
      }
      return null;
    }
  }

  
  static getTimeToExpiry(token) {
    const payload = this.getTokenPayload(token);
    if (!payload) return 0;
    
    return Math.max(0, (payload.exp * 1000) - Date.now());
  }

  
  static willExpireSoon(token, minutesThreshold = 5) {
    const timeToExpiry = this.getTimeToExpiry(token);
    return timeToExpiry > 0 && timeToExpiry < (minutesThreshold * 60 * 1000);
  }
}