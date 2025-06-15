// src/contexts/AuthContext.jsx - VERSIÓN FINAL CLEAN CODE
import React, { createContext, useState, useEffect, useCallback } from 'react';
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

  /**
   * Inicializa la autenticación al cargar la aplicación
   */
  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      if (import.meta.env.DEV) {
        console.log('🔍 Inicializando autenticación...');
      }
      
      // Verificar si hay tokens válidos
      if (!authService.isAuthenticated()) {
        if (import.meta.env.DEV) {
          console.log('🔍 No hay tokens válidos, usuario no autenticado');
        }
        setCurrentUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (import.meta.env.DEV) {
        console.log('🔍 Tokens válidos encontrados, obteniendo datos del usuario...');
      }
      
      const userData = await authService.getCurrentUser();
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuario autenticado correctamente:', userData.username);
      }
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error durante inicialización de autenticación:', error);
      }
      
      // Limpiar estado en caso de error
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Solo mostrar error si no es un problema de token expirado
      if (!ErrorHandler.shouldLogout(error)) {
        setAuthError('Error al verificar la sesión. Intenta iniciar sesión de nuevo.');
      }
      
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registra un nuevo usuario
   */
  const register = async (userData) => {
    try {
      setAuthError(null);
      
      if (import.meta.env.DEV) {
        console.log('📝 Iniciando registro desde contexto...');
      }
      
      const response = await authService.register(userData);
      
      if (import.meta.env.DEV) {
        console.log('✅ Registro exitoso desde contexto');
      }
      
      return response;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error en registro desde contexto:', error);
      }
      
      // El authService ya convirtió el error a formato amigable
      setAuthError(error.message);
      
      // Re-lanzar el error con información de campos para el formulario
      const enhancedError = new Error(error.message);
      enhancedError.fieldErrors = error.fieldErrors || {};
      enhancedError.originalError = error.originalError;
      
      throw enhancedError;
    }
  };

  /**
   * Inicia sesión del usuario
   */
  const login = async (credentials) => {
    try {
      setAuthError(null);
      
      if (import.meta.env.DEV) {
        console.log('🔑 Iniciando login desde contexto...');
      }
      
      const response = await authService.login(credentials);
      
      // Actualizar estado del contexto
      setCurrentUser({
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        roles: response.roles || []
      });
      setIsAuthenticated(true);
      
      if (import.meta.env.DEV) {
        console.log('✅ Login exitoso desde contexto:', response.username);
      }
      
      return response;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error en login desde contexto:', error);
      }
      
      // Limpiar estado en caso de error
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAuthError(error.message);
      
      // Re-lanzar error con información de campos
      const enhancedError = new Error(error.message);
      enhancedError.fieldErrors = error.fieldErrors || {};
      enhancedError.originalError = error.originalError;
      
      throw enhancedError;
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    try {
      setAuthError(null);
      
      if (import.meta.env.DEV) {
        console.log('🚪 Iniciando logout desde contexto...');
      }
      
      await authService.logout();
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error durante logout desde contexto:', error);
      }
      // No mostrar error al usuario para logout, solo limpiar estado
      
    } finally {
      // Siempre limpiar estado del contexto
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      
      if (import.meta.env.DEV) {
        console.log('✅ Logout completado desde contexto');
      }
    }
  };

  /**
   * Actualiza los datos del usuario actual
   */
  const updateCurrentUser = useCallback(async () => {
    try {
      if (!isAuthenticated) return;
      
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      
      if (import.meta.env.DEV) {
        console.log('✅ Datos de usuario actualizados');
      }
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error actualizando usuario:', error);
      }
      
      if (ErrorHandler.shouldLogout(error)) {
        await logout();
      }
    }
  }, [isAuthenticated]);

  /**
   * Valida un código de invitación
   */
  const validateInviteCode = useCallback(async (code) => {
    try {
      const result = await authService.validateInviteCode(code);
      return result;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error validando código de invitación:', error);
      }
      return { valid: false, message: 'Error al validar código' };
    }
  }, []);

  /**
   * Limpia cualquier error de autenticación
   */
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = useCallback((role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.some(userRole => 
      userRole.name === role || userRole === role
    );
  }, [currentUser]);

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = useCallback(() => {
    return hasRole('ROLE_ADMIN') || hasRole('ADMIN');
  }, [hasRole]);

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Valor del contexto optimizado con useMemo
  const value = React.useMemo(() => ({
    // Estado
    currentUser,
    loading,
    isAuthenticated,
    authError,
    
    // Métodos de autenticación
    register,
    login,
    logout,
    updateCurrentUser,
    clearAuthError,
    
    // Utilidades
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