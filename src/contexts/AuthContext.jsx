import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';
import { ErrorHandler } from '../utils/ErrorHandler';
import { TokenStorage } from '../utils/TokenStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!authService.isAuthenticated()) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        return;
      }

      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      if (!ErrorHandler.shouldLogout(error)) {
        setAuthError('Error al verificar la sesión. Intenta iniciar sesión de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (userData) => {
    try {
      setAuthError(null);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      setAuthError(error.message);
      const enhancedError = new Error(error.message);
      enhancedError.fieldErrors = error.fieldErrors || {};
      enhancedError.originalError = error.originalError;
      throw enhancedError;
    }
  };

  const login = async (credentials) => {
    try {
      setAuthError(null);
      const response = await authService.login(credentials);
      setCurrentUser({
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        roles: response.roles || []
      });
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAuthError(error.message);
      const enhancedError = new Error(error.message);
      enhancedError.fieldErrors = error.fieldErrors || {};
      enhancedError.originalError = error.originalError;
      throw enhancedError;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      await authService.logout();
    } catch {
      // Silencio en logout
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    }
  };

  const updateCurrentUser = useCallback(async () => {
    try {
      if (!isAuthenticated) return;
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
    } catch (error) {
      if (ErrorHandler.shouldLogout(error)) {
        await logout();
      }
    }
  }, [isAuthenticated]);

  const validateInviteCode = useCallback(async (code) => {
    try {
      return await authService.validateInviteCode(code);
    } catch {
      return { valid: false, message: 'Error al validar código' };
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const hasRole = useCallback((role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.some(userRole =>
      userRole.name === role || userRole === role
    );
  }, [currentUser]);

  const isAdmin = useCallback(() => {
    return hasRole('ROLE_ADMIN') || hasRole('ADMIN');
  }, [hasRole]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const value = useMemo(() => ({
    currentUser,
    loading,
    isAuthenticated,
    authError,
    token: TokenStorage.getAccessToken(),
    register,
    login,
    logout,
    updateCurrentUser,
    clearAuthError,
    validateInviteCode,
    hasRole,
    isAdmin,
    refreshAuth: initAuth,
    emergencyCleanup: () => TokenStorage.emergencyCleanup()
  }), [
    currentUser,
    loading,
    isAuthenticated,
    authError,
    updateCurrentUser,
    clearAuthError,
    validateInviteCode,
    hasRole,
    isAdmin,
    initAuth
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
