import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ FUNCIÓN PARA INICIALIZAR AUTENTICACIÓN
  const initAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('🔍 No hay token, usuario no autenticado');
        setLoading(false);
        return;
      }

      console.log('🔍 Token encontrado, verificando usuario...');
      
      // ✅ INTENTAR OBTENER USUARIO ACTUAL
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      setIsAuthenticated(true);
      console.log('✅ Usuario autenticado:', userData.username);
      
    } catch (error) {
      console.error('❌ Error al verificar autenticación:', error);
      
      // ✅ SI HAY ERROR, LIMPIAR ESTADO
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FUNCIÓN DE REGISTRO
  const register = async (userData) => {
    try {
      console.log('📝 Registrando usuario...');
      const response = await authService.register(userData);
      console.log('✅ Registro exitoso');
      return response;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  };

  // ✅ FUNCIÓN DE LOGIN
  const login = async (credentials) => {
    try {
      console.log('🔑 Iniciando sesión...');
      const response = await authService.login(credentials);
      
      // ✅ ACTUALIZAR ESTADO DESPUÉS DEL LOGIN
      setCurrentUser({
        username: response.username,
        email: response.email,
        fullName: response.fullName
      });
      setIsAuthenticated(true);
      
      console.log('✅ Login exitoso para:', response.username);
      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  // ✅ FUNCIÓN DE LOGOUT
  const logout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await authService.logout();
    } catch (error) {
      console.error('❌ Error durante el cierre de sesión:', error);
    } finally {
      // ✅ LIMPIAR ESTADO SIEMPRE
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      console.log('✅ Sesión cerrada');
    }
  };

  // ✅ INICIALIZAR AL MONTAR EL COMPONENTE
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const value = React.useMemo(() => ({
    currentUser,
    loading,
    isAuthenticated,
    register,
    login,
    logout
  }), [currentUser, loading, isAuthenticated, register, login, logout]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};