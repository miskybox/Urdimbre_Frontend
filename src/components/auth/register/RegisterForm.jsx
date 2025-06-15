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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // ✅ NUEVO: Estado para validación de código de invitación
  const [inviteCodeStatus, setInviteCodeStatus] = useState({
    isValidating: false,
    isValid: null,
    message: '',
    lastCheckedCode: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // ✅ NUEVO: Función para validar código de invitación en tiempo real
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
      return; // No validar el mismo código dos veces
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

      // Limpiar error de validación local si el código es válido
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

  // ✅ NUEVO: Validar código con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.inviteCode) {
        validateInviteCode(formData.inviteCode);
      }
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [formData.inviteCode, validateInviteCode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const togglePronoun = (selected) => {
    const updated = formData.pronouns.includes(selected)
      ? formData.pronouns.filter((p) => p !== selected)
      : [...formData.pronouns, selected];
    setFormData({ ...formData, pronouns: updated });
    if (errors.pronouns) setErrors({ ...errors, pronouns: '' });
  };

  // Helper functions for field validation
  const validatePronouns = (pronouns) => {
    if (!pronouns.length) return 'Selecciona al menos un pronombre';
    return '';
  };

  const validateUsername = (username) => {
    if (!username.trim()) return 'El nombre de usuarie es obligatorio';
    if (username.length < 3 || username.length > 20) return 'El nombre de usuarie debe tener entre 3 y 20 caracteres';
    if (!(new RegExp(/^[a-zA-Z0-9_-]+$/).exec(username))) return 'El nombre de usuarie solo puede contener letras, números, guiones y guiones bajos';
    return '';
  };

  const validateFirstName = (firstName) => {
    if (!firstName.trim()) return 'El nombre es obligatorio';
    if (firstName.length > 50) return 'El nombre no puede tener más de 50 caracteres';
    if (!(new RegExp(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).exec(firstName))) return 'El nombre solo puede contener letras y espacios';
    return '';
  };

  const validateLastName = (lastName) => {
    if (!lastName.trim()) return 'El apellido es obligatorio';
    if (lastName.length > 50) return 'El apellido no puede tener más de 50 caracteres';
    if (!(new RegExp(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).exec(lastName))) return 'El apellido solo puede contener letras y espacios';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'El correo es obligatorio';
    if (!(new RegExp(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).exec(email))) return 'El formato del email no es válido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (!(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).exec(password))) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (@$!%*?&)';
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  };

  const validateInviteCodeField = (inviteCode, inviteCodeStatus) => {
    if (!inviteCode.trim()) return 'El código de invitación es obligatorio';
    if (inviteCodeStatus.isValidating) return 'Validando código...';
    if (inviteCodeStatus.isValid === false) return inviteCodeStatus.message || 'Código de invitación inválido';
    if (inviteCodeStatus.isValid === null && inviteCode.trim()) return 'Verifica el código de invitación';
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

  const validateForm = () => {
    const newErrors = {};

    const pronounsError = validatePronouns(formData.pronouns);
    if (pronounsError) newErrors.pronouns = pronounsError;

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const firstNameError = validateFirstName(formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateLastName(formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const inviteCodeError = validateInviteCodeField(formData.inviteCode, inviteCodeStatus);
    if (inviteCodeError) newErrors.inviteCode = inviteCodeError;

    const privacyError = validatePrivacy(formData.acceptPrivacy);
    if (privacyError) newErrors.acceptPrivacy = privacyError;

    const termsError = validateTerms(formData.acceptTerms);
    if (termsError) newErrors.acceptTerms = termsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Extrae el manejo de errores a una función separada para reducir la complejidad
  const handleRegisterError = async (error, formData, setErrors, validateInviteCode) => {
    console.error('Error completo:', error);
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.includes('código de invitación')) {
        toast.error('Código de invitación inválido o expirado');
        setErrors(prev => ({ ...prev, inviteCode: 'Código inválido o expirado' }));
        // Re-validar el código
        validateInviteCode(formData.inviteCode);
      } else if (errorMessage.includes('username')) {
        toast.error('Nombre de usuario no disponible');
        setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
      } else if (errorMessage.includes('email')) {
        toast.error('Email ya registrado');
        setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
      } else if (errorMessage.includes('contraseña') || errorMessage.includes('password')) {
        toast.error('Contraseña no cumple los requisitos');
      } else {
        toast.error('Datos inválidos. Revisa los campos marcados.');
      }
    } else if (error.response?.status === 409) {
      toast.error('El usuario o email ya existe. Prueba con otros datos.');
    } else if (error.response?.status === 429) {
      toast.error('Demasiados intentos. Intenta de nuevo más tarde.');
    } else if (error.response?.status === 500) {
      toast.error('Error del servidor. Inténtalo de nuevo en unos momentos.');
    } else if (!error.response) {
      toast.error('Sin conexión al servidor. Verifica tu conexión a internet.');
    } else {
      toast.error('Error inesperado. Inténtalo de nuevo.');
    }
    const backendErrors = error.response?.data?.errors || {};
    setErrors(prev => ({ ...prev, ...backendErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDACIÓN FINAL DEL CÓDIGO ANTES DE ENVIAR
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

    console.log('Datos enviados al backend:', userData);

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
      }, 6000);
    } catch (error) {
      await handleRegisterError(error, formData, setErrors, validateInviteCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FUNCIÓN PARA OBTENER EL ESTILO DEL INPUT DE CÓDIGO
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
            >
              {p}
            </button>
          ))}
        </fieldset>
        {errors.pronouns && <p className={styles.error}>{errors.pronouns}</p>}

        <label htmlFor="username" className={styles.label}>Nombre de Usuarie</label>
        <input 
          id="username" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          className={styles.input}
          placeholder="Elige un nombre único"
        />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label htmlFor="firstName" className={styles.label}>Nombre</label>
        <input 
          id="firstName" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          className={styles.input}
          placeholder="Tu nombre"
        />
        {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}

        <label htmlFor="lastName" className={styles.label}>Apellido</label>
        <input 
          id="lastName" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          className={styles.input}
          placeholder="Tu apellido"
        />
        {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}

        <label htmlFor="email" className={styles.label}>Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          className={styles.input}
          placeholder="tu@email.com"
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label htmlFor="password" className={styles.label}>Contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
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
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label htmlFor="confirmPassword" className={styles.label}>Confirma tu Contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
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
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

        {/* ✅ CAMPO DE CÓDIGO DE INVITACIÓN MEJORADO */}
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
        {errors.inviteCode && <p className={styles.error}>{errors.inviteCode}</p>}

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={handleChange}
            />
            He leído y acepto la <Link to="/privacy" target="_blank" rel="noopener noreferrer">política de privacidad</Link>.
          </label>
          {errors.acceptPrivacy && <p className={styles.error}>{errors.acceptPrivacy}</p>}

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            Acepto los <Link to="/terms" target="_blank" rel="noopener noreferrer">términos y condiciones</Link>.
          </label>
          {errors.acceptTerms && <p className={styles.error}>{errors.acceptTerms}</p>}
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={() => navigate('/')}>
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