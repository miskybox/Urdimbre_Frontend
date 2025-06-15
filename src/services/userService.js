// src/services/userService.js - CLEAN CODE FINAL
import api from '../config/api.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

/**
 * 👥 UserService - Gestión de usuarios Clean Code
 * Responsabilidad única: Operaciones CRUD de usuarios + manejo de errores
 */
class UserService {

  /**
   * Obtiene todos los usuarios (solo admin)
   */
  async getAllUsers() {
    try {
      if (import.meta.env.DEV) {
        console.log('👥 Obteniendo todos los usuarios...');
      }
      
      const response = await api.get('/users');
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuarios obtenidos exitosamente:', response.data.length, 'usuarios');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error obteniendo usuarios:', error.message);
      }
      
      // Manejo de error amigable
      const userMessage = ErrorHandler.handleApiError(error, 'obtener usuarios');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Actualiza el rol de un usuario (solo admin)
   */
  async updateUserRole(userId, newRole) {
    if (!userId || !newRole) {
      throw new Error('ID de usuario y nuevo rol son requeridos');
    }

    try {
      if (import.meta.env.DEV) {
        console.log(`👥 Actualizando rol del usuario ${userId} a ${newRole}...`);
      }
      
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      
      if (import.meta.env.DEV) {
        console.log('✅ Rol actualizado exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error actualizando rol:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'actualizar rol de usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }

    try {
      if (import.meta.env.DEV) {
        console.log(`👥 Obteniendo usuario ${userId}...`);
      }
      
      const response = await api.get(`/users/${userId}`);
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuario obtenido exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error obteniendo usuario:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'obtener usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Actualiza el perfil del usuario actual
   */
  async updateProfile(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Datos de usuario inválidos');
    }

    try {
      if (import.meta.env.DEV) {
        console.log('👥 Actualizando perfil del usuario...');
      }
      
      const response = await api.put('/users/profile', userData);
      
      if (import.meta.env.DEV) {
        console.log('✅ Perfil actualizado exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error actualizando perfil:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'actualizar perfil');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Cambia la contraseña del usuario actual
   */
  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Contraseña actual y nueva contraseña son requeridas');
    }

    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }

    try {
      if (import.meta.env.DEV) {
        console.log('👥 Cambiando contraseña...');
      }
      
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      
      if (import.meta.env.DEV) {
        console.log('✅ Contraseña cambiada exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error cambiando contraseña:', error.message);
      }
      
      // Manejo específico para errores de contraseña
      let userMessage;
      if (error.response?.status === 400) {
        userMessage = 'La contraseña actual es incorrecta';
      } else {
        userMessage = ErrorHandler.handleApiError(error, 'cambiar contraseña');
      }
      
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Busca usuarios con filtros (solo admin)
   */
  async searchUsers(filters = {}) {
    try {
      if (import.meta.env.DEV) {
        console.log('👥 Buscando usuarios con filtros:', filters);
      }
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/users/search?${params.toString()}`);
      
      if (import.meta.env.DEV) {
        console.log('✅ Búsqueda completada:', response.data.length, 'resultados');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error en búsqueda de usuarios:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'buscar usuarios');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Desactiva un usuario (soft delete - solo admin)
   */
  async deactivateUser(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }

    try {
      if (import.meta.env.DEV) {
        console.log(`👥 Desactivando usuario ${userId}...`);
      }
      
      const response = await api.patch(`/users/${userId}/deactivate`);
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuario desactivado exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error desactivando usuario:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'desactivar usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Activa un usuario (solo admin)
   */
  async activateUser(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }

    try {
      if (import.meta.env.DEV) {
        console.log(`👥 Activando usuario ${userId}...`);
      }
      
      const response = await api.patch(`/users/${userId}/activate`);
      
      if (import.meta.env.DEV) {
        console.log('✅ Usuario activado exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error activando usuario:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'activar usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }

  /**
   * Obtiene estadísticas de usuarios (solo admin)
   */
  async getUserStats() {
    try {
      if (import.meta.env.DEV) {
        console.log('📊 Obteniendo estadísticas de usuarios...');
      }
      
      const response = await api.get('/users/stats');
      
      if (import.meta.env.DEV) {
        console.log('✅ Estadísticas obtenidas exitosamente');
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error obteniendo estadísticas:', error.message);
      }
      
      const userMessage = ErrorHandler.handleApiError(error, 'obtener estadísticas');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      
      throw friendlyError;
    }
  }
}

// Instancia única
const userService = new UserService();

// Utilidades de desarrollo
if (import.meta.env.DEV) {
  window.userService = userService;
  
  console.log('🔧 UserService Clean - Utilidad de desarrollo:');
  console.log('   • window.userService - Acceso directo al servicio');
}

export default userService;