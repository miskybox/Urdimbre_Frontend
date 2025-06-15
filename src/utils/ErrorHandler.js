// src/utils/ErrorHandler.js
/**
 * 🚨 ErrorHandler - Manejo centralizado de errores
 * Responsabilidad única: Convertir errores técnicos en mensajes amigables
 */
export class ErrorHandler {
  
  /**
   * Maneja errores de autenticación (login/register)
   */
  static handleAuthError(error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const errorData = error.response?.data || {};

    let userMessage = '';
    let fieldErrors = {};

    switch (status) {
      case 400:
        if (message.includes('código de invitación') || message.includes('invite')) {
          userMessage = 'Código de invitación inválido o expirado';
          fieldErrors.inviteCode = 'Código inválido o expirado';
        } else if (message.includes('username') || message.includes('usuario')) {
          userMessage = 'Nombre de usuario no disponible';
          fieldErrors.username = 'Este nombre de usuario ya está en uso';
        } else if (message.includes('email') || message.includes('correo')) {
          userMessage = 'Email ya registrado';
          fieldErrors.email = 'Este email ya está registrado';
        } else if (message.includes('password') || message.includes('contraseña')) {
          userMessage = 'Contraseña no cumple los requisitos';
          fieldErrors.password = 'La contraseña no cumple los requisitos de seguridad';
        } else if (message.includes('credenciales') || message.includes('credentials')) {
          userMessage = 'Usuario o contraseña incorrectos';
          fieldErrors.password = 'Usuario o contraseña incorrectos';
        } else {
          userMessage = 'Datos inválidos. Revisa los campos marcados.';
        }
        break;

      case 401:
        userMessage = 'Usuario o contraseña incorrectos';
        fieldErrors.password = 'Usuario o contraseña incorrectos';
        break;

      case 403:
        userMessage = 'Acceso denegado. Verifica tus permisos.';
        break;

      case 409:
        userMessage = 'El usuario o email ya existe. Prueba con otros datos.';
        break;

      case 429:
        userMessage = 'Demasiados intentos. Intenta de nuevo más tarde.';
        break;

      case 500:
        userMessage = 'Error del servidor. Inténtalo de nuevo en unos momentos.';
        break;

      default:
        if (!error.response) {
          userMessage = 'Sin conexión al servidor. Verifica tu conexión a internet.';
        } else {
          userMessage = 'Error inesperado. Inténtalo de nuevo.';
        }
    }

    // Combinar errores del backend si existen
    const backendErrors = errorData.errors || {};
    fieldErrors = { ...fieldErrors, ...backendErrors };

    return {
      userMessage,
      fieldErrors,
      originalError: error
    };
  }

  /**
   * Maneja errores de API generales
   */
  static handleApiError(error, context = 'operación') {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    switch (status) {
      case 401:
        return `Tu sesión ha expirado. Por favor, inicia sesión de nuevo.`;
      case 403:
        return `No tienes permisos para realizar esta ${context}.`;
      case 404:
        return `El recurso solicitado no fue encontrado.`;
      case 429:
        return `Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.`;
      case 500:
        return `Error del servidor. Intenta de nuevo más tarde.`;
      default:
        if (!error.response) {
          return `Sin conexión al servidor. Verifica tu conexión a internet.`;
        }
        return message || `Error al realizar la ${context}. Inténtalo de nuevo.`;
    }
  }

  /**
   * Determina si un error requiere cerrar sesión
   */
  static shouldLogout(error) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }

  /**
   * Determina si un error es temporal (reintentar)
   */
  static isTemporaryError(error) {
    const status = error.response?.status;
    return status === 429 || status >= 500 || !error.response;
  }
}