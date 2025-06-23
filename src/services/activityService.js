import api from '../config/api.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';


class ActivityService {
  
  async createActivity(activityData) {
    try {
      if (import.meta.env.DEV) {
        console.log('📅 Creando nueva actividad...', activityData);
      }

      const response = await api.post('/activities', activityData);

      if (import.meta.env.DEV) {
        console.log('✅ Actividad creada con éxito:', response.data);
      }

      return response.data;

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error al crear actividad:', error.message);
      }

      const userMessage = ErrorHandler.handleApiError(error, 'crear actividad');
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;

      throw friendlyError;
    }
  }

  async getAllActivities() {
    try {
      const response = await api.get('/activities');
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'obtener actividades');
      throw new Error(userMessage);
    }
  }

 
  async getActivityById(activityId) {
    try {
      const response = await api.get(`/activities/${activityId}`);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'obtener actividad');
      throw new Error(userMessage);
    }
  }

  async deleteActivity(id) {
    try {
      const response = await api.delete(`/activities/${id}`);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'eliminar actividad');
      throw new Error(userMessage);
    }
  }

  async updateActivity(id, updatedData) {
    try {
      const response = await api.put(`/activities/${id}`, updatedData);
      return response.data;
    } catch (error) {
      const userMessage = ErrorHandler.handleApiError(error, 'actualizar actividad');
      throw new Error(userMessage);
    }
  }
}

const activityService = new ActivityService();

if (import.meta.env.DEV) {
  window.activityService = activityService;
  console.log('🔧 ActivityService Clean - Acceso disponible por consola');
}

export default activityService;
