import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { toast } from 'react-hot-toast';
import styles from './RegisterForm.module.css';

const pronouns = ['Elle', 'Ella', 'El'];

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    pronouns: [],
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    inviteCode: '',
    acceptPrivacy: false,
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Estado para validación de código de invitación
  const [inviteCodeStatus, setInviteCodeStatus] = useState({
    isValidating: false,
    isValid: null,
    message: '',
    lastCheckedCode: ''
  });

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ LIMPIEZA AUTOMÁTICA AL MONTAR EL COMPONENTE
  useEffect(() => {
    setErrors({});
    setFieldTouched({});
    setInviteCodeStatus({
      isValidating: false,
      isValid: null,
      message: '',
      lastCheckedCode: ''
    });

    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    window.clearFormErrors = () => {
      setErrors({});
      setFieldTouched({});
      setInviteCodeStatus({
        isValidating: false,
        isValid: null,
        message: '',
        lastCheckedCode: ''
      });
      if (import.meta.env.DEV) {
        console.log('🧹 Errores del formulario limpiados');
      }
    };

    return () => {
      if (window.clearFormErrors) {
        delete window.clearFormErrors;
      }
    };
  }, [isAuthenticated, navigate]);

  // Funciones de validación individual
  const validatePronouns = (pronouns) => {
    if (!pronouns.length) return 'Selecciona al menos un pronombre';
    return '';
  };

  const validateUsername = (username) => {
    if (!username.trim()) return 'El nombre de usuarie es obligatorio';
    if (username.length < 3) return 'Mínimo 3 caracteres';
    if (username.length > 20) return 'Máximo 20 caracteres';
    if (!(new RegExp(/^[a-zA-Z0-9_-]+$/).exec(username))) return 'Solo letras, números, guiones y guiones bajos';
    return '';
  };

  const validateFirstName = (firstName) => {
    if (!firstName.trim()) return 'El nombre es obligatorio';
    if (firstName.length > 50) return 'Máximo 50 caracteres';
    if (!(new RegExp(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).exec(firstName))) return 'Solo letras y espacios';
    return '';
  };

  const validateLastName = (lastName) => {
    if (!lastName.trim()) return 'El apellido es obligatorio';
    if (lastName.length > 50) return 'Máximo 50 caracteres';
    if (!(new RegExp(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).exec(lastName))) return 'Solo letras y espacios';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'El correo es obligatorio';
    if (!(new RegExp(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).exec(email))) return 'Formato de email inválido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'Mínimo 8 caracteres';
    if (!/[a-z]/.test(password)) return 'Debe incluir al menos una minúscula';
    if (!/[A-Z]/.test(password)) return 'Debe incluir al menos una mayúscula';
    if (!/\d/.test(password)) return 'Debe incluir al menos un número';
    if (!/[@$!%*?&]/.test(password)) return 'Debe incluir un símbolo (@$!%*?&)';
    return '';
  };

  const getPasswordRequirements = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[@$!%*?&]/.test(password)
    };
  };

  // ✅ FUNCIÓN MEJORADA PARA VERIFICAR DISPONIBILIDAD DE USERNAME
  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/check-username?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (!data.available) {
          setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
        } else {
          setErrors(prev => ({ ...prev, username: '' }));
        }
      } else {
        // Si hay error en la verificación, no mostrar error al usuario
        console.warn('Error verificando disponibilidad de username');
      }
    } catch (error) {
      console.warn('Error verificando username:', error);
    }
  }, []);

  // ✅ FUNCIÓN MEJORADA PARA VERIFICAR DISPONIBILIDAD DE EMAIL
  const checkEmailAvailability = useCallback(async (email) => {
    if (!email || !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/check-email?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (!data.available) {
          setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      } else {
        console.warn('Error verificando disponibilidad de email');
      }
    } catch (error) {
      console.warn('Error verificando email:', error);
    }
  }, []);

  // Debounce para verificar username y email
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.username && fieldTouched.username) {
        checkUsernameAvailability(formData.username);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData.username, fieldTouched.username, checkUsernameAvailability]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email && fieldTouched.email) {
        checkEmailAvailability(formData.email);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData.email, fieldTouched.email, checkEmailAvailability]);

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  };

  const validateInviteCodeField = (inviteCode, inviteCodeStatus) => {
    if (!inviteCode.trim()) return 'El código de invitación es obligatorio';
    if (inviteCode.length < 3) return 'El código es muy corto';
    if (inviteCodeStatus.isValidating) return 'Validando código...';
    if (inviteCodeStatus.isValid === false) return inviteCodeStatus.message || 'Código inválido';
    if (inviteCodeStatus.isValid === null && inviteCode.trim()) return 'Verificando código...';
    return '';
  };

  const validatePrivacy = (acceptPrivacy) => {
    if (!acceptPrivacy) return 'Debes aceptar la política de privacidad';
    return '';
  };

  const validateTerms = (acceptTerms) => {
    if (!acceptTerms) return 'Debes aceptar los términos y condiciones';
    return '';
  };

  const validateField = useCallback((fieldName, value, additionalData = {}) => {
    let error = '';
    
    switch (fieldName) {
      case 'pronouns':
        error = validatePronouns(value);
        break;
      case 'username':
        error = validateUsername(value);
        break;
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'lastName':
        error = validateLastName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        if (fieldTouched.confirmPassword && formData.confirmPassword) {
          const confirmError = validateConfirmPassword(value, formData.confirmPassword);
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(additionalData.password || formData.password, value);
        break;
      case 'inviteCode':
        error = validateInviteCodeField(value, inviteCodeStatus);
        break;
      case 'acceptPrivacy':
        error = validatePrivacy(value);
        break;
      case 'acceptTerms':
        error = validateTerms(value);
        break;
      default:
        break;
    }

    return error;
  }, [formData.password, formData.confirmPassword, fieldTouched.confirmPassword, inviteCodeStatus]);

  const handleBlur = (fieldName) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const fieldValue = fieldName === 'pronouns' ? formData.pronouns : formData[fieldName];
    const error = validateField(fieldName, fieldValue);
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleRealTimeValidation = (fieldName, value) => {
    if (fieldTouched[fieldName]) {
      const error = validateField(fieldName, value, { password: formData.password });
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  // Función para validar código de invitación en tiempo real
  const validateInviteCode = useCallback(async (code) => {
    if (!code || code.trim().length < 3) {
      setInviteCodeStatus({
        isValidating: false,
        isValid: null,
        message: '',
        lastCheckedCode: code
      });
      return;
    }

    if (code === inviteCodeStatus.lastCheckedCode) {
      return;
    }

    setInviteCodeStatus(prev => ({
      ...prev,
      isValidating: true,
      lastCheckedCode: code
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/invite-codes/info?code=${encodeURIComponent(code)}`);
      const data = await response.json();

      setInviteCodeStatus({
        isValidating: false,
        isValid: data.valid,
        message: data.message || (data.valid ? 'Código válido' : 'Código inválido'),
        lastCheckedCode: code
      });

      if (data.valid && errors.inviteCode) {
        setErrors(prev => ({ ...prev, inviteCode: '' }));
      }

    } catch (error) {
      console.error('Error validando código:', error);
      setInviteCodeStatus({
        isValidating: false,
        isValid: false,
        message: 'Error al validar código. Verifica tu conexión.',
        lastCheckedCode: code
      });
    }
  }, [inviteCodeStatus.lastCheckedCode, errors.inviteCode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.inviteCode) {
        validateInviteCode(formData.inviteCode);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.inviteCode, validateInviteCode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: fieldValue });
    
    // Limpiar errores del backend cuando el usuario modifica el campo
    if (errors[name] && (name === 'username' || name === 'email')) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    handleRealTimeValidation(name, fieldValue);
  };

  const togglePronoun = (selected) => {
    const updated = formData.pronouns.includes(selected)
      ? formData.pronouns.filter((p) => p !== selected)
      : [...formData.pronouns, selected];
      
    setFormData({ ...formData, pronouns: updated });
    
    if (fieldTouched.pronouns) {
      const error = validateField('pronouns', updated);
      setErrors({ ...errors, pronouns: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const error = validateField(fieldName, fieldValue);
      if (error) newErrors[fieldName] = error;
    });

    const allFieldsTouched = {};
    Object.keys(formData).forEach(field => {
      allFieldsTouched[field] = true;
    });
    setFieldTouched(allFieldsTouched);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ MANEJO DE ERRORES MEJORADO
  // Helper functions for error handling
  const handleTooManyRequests = (error) => {
    const retryAfter = error.response?.headers?.['retry-after'];
    let message = 'Demasiados intentos de registro. ';
    if (retryAfter) {
      const minutes = Math.ceil(retryAfter / 60);
      message += `Inténtalo de nuevo en ${minutes} minuto${minutes > 1 ? 's' : ''}.`;
    } else {
      message += 'Inténtalo de nuevo más tarde.';
    }
    toast.error(message);
  };

  const handleBadRequest = async (error, errorMessage) => {
    if (errorMessage.includes('nombre de usuario') && errorMessage.includes('ya está en uso')) {
      setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
      toast.error('❌ El nombre de usuario ya está en uso. Prueba con otro.');
      await checkUsernameAvailability(formData.username);
      return true;
    }
    if (errorMessage.includes('email') && errorMessage.includes('ya está')) {
      setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
      toast.error('❌ El email ya está registrado. Usa otro email o inicia sesión.');
      await checkEmailAvailability(formData.email);
      return true;
    }
    if (errorMessage.includes('código de invitación')) {
      setErrors(prev => ({ ...prev, inviteCode: 'Código de invitación inválido o expirado' }));
      toast.error('❌ Código de invitación inválido o expirado');
      await validateInviteCode(formData.inviteCode);
      return true;
    }
    if (errorMessage.includes('contraseña') || errorMessage.includes('password')) {
      setErrors(prev => ({ ...prev, password: 'La contraseña no cumple los requisitos' }));
      toast.error('❌ La contraseña no cumple los requisitos de seguridad');
      return true;
    }
    if (errorMessage) {
      toast.error('❌ Datos inválidos. Revisa los campos marcados.');
      return true;
    }
    return false;
  };

  const handleConflict = async (error, errorMessage) => {
    if (errorMessage.includes('username') || errorMessage.includes('usuario')) {
      setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
      toast.error('❌ Este nombre de usuario ya está en uso');
      await checkUsernameAvailability(formData.username);
      return true;
    }
    if (errorMessage.includes('email') || errorMessage.includes('correo')) {
      setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
      toast.error('❌ Este email ya está registrado');
      await checkEmailAvailability(formData.email);
      return true;
    }
    if (errorMessage.includes('usuario') || errorMessage.includes('email')) {
      toast.error('❌ El usuario o email ya existe. Prueba con otros datos.');
      return true;
    }
    return false;
  };

  const handleOtherErrors = (error) => {
    if (error.response?.status === 500) {
      toast.error('🛠️ Error del servidor. Inténtalo de nuevo en unos momentos.');
    } else if (!error.response) {
      toast.error('🌐 Sin conexión al servidor. Verifica tu conexión a internet.');
    } else {
      toast.error('❓ Error inesperado. Inténtalo de nuevo.');
    }
  };

  const handleBackendFieldErrors = (error) => {
    const backendErrors = error.response?.data?.errors || {};
    if (Object.keys(backendErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...backendErrors }));
    }
  };

  const handleRegisterError = async (error) => {
    console.error('Error en registro:', error);
    setErrors({});

    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || '';

    if (status === 429) {
      handleTooManyRequests(error);
      return;
    }

    if (status === 400) {
      const handled = await handleBadRequest(error, errorMessage);
      if (handled) return;
    }

    if (status === 409) {
      const handled = await handleConflict(error, errorMessage);
      if (handled) return;
    }

    handleOtherErrors(error);
    handleBackendFieldErrors(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inviteCodeStatus.isValid !== true) {
      toast.error('Por favor, usa un código de invitación válido');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    const userData = {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      pronouns: formData.pronouns,
      password: formData.password,
      email: formData.email,
      inviteCode: formData.inviteCode
    };

    if (import.meta.env.DEV) {
      console.log('Datos enviados al backend:', userData);
    }

    try {
      await register(userData);
      setRegistrationSuccess(true);
      toast.success(`¡Registro exitoso! Bienvenide ${formData.username} 🎉`);
      
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: `¡Hola ${formData.username}! Tu cuenta ha sido creada exitosamente.`,
            username: formData.username
          }
        });
      }, 2000);
    } catch (error) {
      await handleRegisterError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInviteCodeInputStyle = () => {
    if (inviteCodeStatus.isValidating) {
      return `${styles.input} ${styles.validating}`;
    } else if (inviteCodeStatus.isValid === true) {
      return `${styles.input} ${styles.valid}`;
    } else if (inviteCodeStatus.isValid === false) {
      return `${styles.input} ${styles.invalid}`;
    }
    return styles.input;
  };

  const shouldShowError = (fieldName) => {
    return fieldTouched[fieldName] && errors[fieldName];
  };

  if (registrationSuccess) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>¡Registro Exitoso!</h2>
          <p className={styles.successMessage}>
            ¡Hola <strong>{formData.username}</strong>! Tu cuenta ha sido creada exitosamente.
          </p>
          <p className={styles.successSubtext}>Redirigiendo al inicio de sesión...</p>
          <div className={styles.successActions}>
            <Link
              to="/login"
              className={`${styles.button} ${styles.loginButton}`}
              state={{
                message: `¡Hola ${formData.username}! Tu cuenta ha sido creada exitosamente.`,
                username: formData.username
              }}
            >
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Únete a Urdimbre</h2>
      
      <form onSubmit={handleSubmit}>
        <fieldset className={styles.pronounGroup}>
          <legend className={styles.label}>Pronombres</legend>
          {pronouns.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pronounButton} ${formData.pronouns.includes(p) ? styles.selected : ''}`}
              onClick={() => togglePronoun(p)}
              onBlur={() => handleBlur('pronouns')}
            >
              {p}
            </button>
          ))}
        </fieldset>
        {shouldShowError('pronouns') && <p className={styles.error}>{errors.pronouns}</p>}

        <label htmlFor="username" className={styles.label}>Nombre de Usuarie</label>
        <input 
          id="username" 
          name="username" 
          value={formData.username} 
          onChange={handleChange}
          onBlur={() => handleBlur('username')}
          className={`${styles.input} ${shouldShowError('username') ? styles.inputError : ''}`}
          placeholder="Elige un nombre único"
        />
        {shouldShowError('username') && <p className={styles.error}>{errors.username}</p>}

        <label htmlFor="firstName" className={styles.label}>Nombre</label>
        <input 
          id="firstName" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange}
          onBlur={() => handleBlur('firstName')}
          className={`${styles.input} ${shouldShowError('firstName') ? styles.inputError : ''}`}
          placeholder="Tu nombre"
        />
        {shouldShowError('firstName') && <p className={styles.error}>{errors.firstName}</p>}

        <label htmlFor="lastName" className={styles.label}>Apellido</label>
        <input 
          id="lastName" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange}
          onBlur={() => handleBlur('lastName')}
          className={`${styles.input} ${shouldShowError('lastName') ? styles.inputError : ''}`}
          placeholder="Tu apellido"
        />
        {shouldShowError('lastName') && <p className={styles.error}>{errors.lastName}</p>}

        <label htmlFor="email" className={styles.label}>Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          className={`${styles.input} ${shouldShowError('email') ? styles.inputError : ''}`}
          placeholder="tu@email.com"
        />
        {shouldShowError('email') && <p className={styles.error}>{errors.email}</p>}

        <label htmlFor="password" className={styles.label}>Contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            className={`${styles.input} ${shouldShowError('password') ? styles.inputError : ''}`}
            placeholder="Introduce tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.toggleButton}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        
        <div className={styles.passwordRequirements}>
          <p className={styles.requirementsTitle}>La contraseña debe incluir:</p>
          {(() => {
            const requirements = getPasswordRequirements(formData.password);
            return (
              <ul className={styles.requirementsList}>
                <li className={`${styles.requirement} ${requirements.length ? styles.fulfilled : ''}`}>
                  <span className={styles.requirementIcon}>{requirements.length ? '✓' : '○'}</span>{" "}
                  Al menos 8 caracteres
                </li>
                <li className={`${styles.requirement} ${requirements.uppercase ? styles.fulfilled : ''}`}>
                  <span className={styles.requirementIcon}>{requirements.uppercase ? '✓' : '○'}</span>{' '}
                  Una letra mayúscula (A-Z)
                </li>
                <li className={`${styles.requirement} ${requirements.lowercase ? styles.fulfilled : ''}`}>
                  <span className={styles.requirementIcon}>{requirements.lowercase ? '✓' : '○'}</span>{' '}
                  Una letra minúscula (a-z)
                </li>
                <li className={`${styles.requirement} ${requirements.number ? styles.fulfilled : ''}`}>
                  <span className={styles.requirementIcon}>{requirements.number ? '✓' : '○'}</span>{' '}
                  Un número (0-9)
                </li>
                <li className={`${styles.requirement} ${requirements.symbol ? styles.fulfilled : ''}`}>
                  <span className={styles.requirementIcon}>{requirements.symbol ? '✓' : '○'}</span>{' '}
                  Un símbolo (@$!%*?&)
                </li>
              </ul>
            );
          })()}
        </div>
        
        {shouldShowError('password') && <p className={styles.error}>{errors.password}</p>}

        <label htmlFor="confirmPassword" className={styles.label}>Confirma tu Contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            className={`${styles.input} ${shouldShowError('confirmPassword') ? styles.inputError : ''}`}
            placeholder="Repite tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.toggleButton}
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {shouldShowError('confirmPassword') && <p className={styles.error}>{errors.confirmPassword}</p>}

        <label htmlFor="inviteCode" className={styles.label}>
          Código de Invitación
          {inviteCodeStatus.isValidating && <span className={styles.validatingText}> (validando...)</span>}
        </label>
        <div className={styles.inputGroup}>
          <input 
            id="inviteCode" 
            name="inviteCode" 
            value={formData.inviteCode} 
            onChange={handleChange}
            onBlur={() => handleBlur('inviteCode')}
            className={getInviteCodeInputStyle()}
            placeholder="Introduce tu código de invitación"
          />
          {inviteCodeStatus.isValid === true && (
            <span className={styles.validIcon}>✅</span>
          )}
          {inviteCodeStatus.isValid === false && (
            <span className={styles.invalidIcon}>❌</span>
          )}
        </div>
        {inviteCodeStatus.message && (
          <p className={inviteCodeStatus.isValid ? styles.success : styles.error}>
            {inviteCodeStatus.message}
          </p>
        )}
        {shouldShowError('inviteCode') && <p className={styles.error}>{errors.inviteCode}</p>}

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={handleChange}
              onBlur={() => handleBlur('acceptPrivacy')}
            />
            He leído y acepto la <a href="/privacy" target="_blank" rel="noopener noreferrer">
           política de privacida </a>

          </label>
          {shouldShowError('acceptPrivacy') && <p className={styles.error}>{errors.acceptPrivacy}</p>}

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              onBlur={() => handleBlur('acceptTerms')}
            />
            Acepto los <a href="/terms" target="_blank"  rel="noopener noreferrer" className={styles.footerLink}>
            Términos y condiciones
</a>

          </label>
          {shouldShowError('acceptTerms') && <p className={styles.error}>{errors.acceptTerms}</p>}
        </div>

        <div className={styles.buttonContainer}>
          <button 
            type="button" 
            className={`${styles.button} ${styles.cancelButton}`} 
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={`${styles.button} ${styles.createButton}`} 
            disabled={isSubmitting || inviteCodeStatus.isValidating || inviteCodeStatus.isValid !== true}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;