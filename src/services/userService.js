import api from '../config/api.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

class UserService {
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'obtener usuarios');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async updateUserRole(userId, newRole) {
    if (!userId || !newRole) {
      throw new Error('ID de usuario y nuevo rol son requeridos');
    }
    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'actualizar rol de usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async getUserById(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'obtener usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async updateProfile(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Datos de usuario inválidos');
    }
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'actualizar perfil');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Contraseña actual y nueva contraseña son requeridas');
    }
    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
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

  async searchUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      const response = await api.get(`/users/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'buscar usuarios');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async deactivateUser(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }
    try {
      const response = await api.patch(`/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'desactivar usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async activateUser(userId) {
    if (!userId) {
      throw new Error('ID de usuario es requerido');
    }
    try {
      const response = await api.patch(`/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'activar usuario');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }

  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'obtener estadísticas');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    }
  }
}

const userService = new UserService();
export default userService;
