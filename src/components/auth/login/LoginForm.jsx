import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { toast } from 'react-hot-toast';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, { duration: 4000 });
      if (location.state?.username) {
        setFormData(prev => ({ ...prev, username: location.state.username }));
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (loginAttempts >= 5) {
      setCooldown(true);
      toast.error('Demasiados intentos fallidos. Espera 30 segundos antes de intentar de nuevo.');
      const timer = setTimeout(() => {
        setLoginAttempts(0);
        setCooldown(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const validateUsername = (username) => {
    if (!username.trim()) return 'El nombre de usuarie es obligatorio';
    if (username.length < 3) return 'Mínimo 3 caracteres';
    if (username.length > 20) return 'Máximo 20 caracteres';
    return '';
  };

  const validatePassword = (password) => {
    if (!password.trim()) return 'La contraseña es obligatoria';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'El email es obligatorio para recuperar la contraseña';
    if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) return 'Formato de email inválido';
    return '';
  };

  const validateField = useCallback((fieldName, value) => {
    let error = '';
    switch (fieldName) {
      case 'username': return validateUsername(value);
      case 'password': return validatePassword(value);
      case 'email': return validateEmail(value);
      default: return '';
    }
  }, []);

  const handleBlur = (fieldName) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    const value = fieldName === 'email' ? recoveryEmail : formData[fieldName];
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleRealTimeValidation = (fieldName, value) => {
    if (fieldTouched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const shouldShowError = (fieldName) => {
    return fieldTouched[fieldName] && errors[fieldName];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[<>"']/g, '');
    setFormData({ ...formData, [name]: sanitizedValue });
    handleRealTimeValidation(name, sanitizedValue);
    if (errors.auth) setErrors(prev => ({ ...prev, auth: '' }));
  };

  const handleRecoveryEmailChange = (e) => {
    const value = e.target.value.replace(/[<>"']/g, '');
    setRecoveryEmail(value);
    handleRealTimeValidation('email', value);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setFieldTouched({ username: true, password: true });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordRecovery = async () => {
    const emailError = validateEmail(recoveryEmail);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      setFieldTouched(prev => ({ ...prev, email: true }));
      return;
    }
    setIsRecovering(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });

      if (response.ok) {
        toast.success(`📧 Enlace enviado a ${recoveryEmail}. Revisa tu correo.`, { duration: 6000 });
        setShowRecovery(false);
        setRecoveryEmail('');
        setErrors(prev => ({ ...prev, email: '' }));
      } else {
        const data = await response.json();
        if (response.status === 404) toast.error('No encontramos una cuenta con ese email.');
        else toast.error(data.message || 'Error al enviar el enlace.');
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsRecovering(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || cooldown) return;
    setIsSubmitting(true);
    try {
      const response = await login(formData);
      toast.success(`¡Bienvenide de vuelta, ${response.username || formData.username}! 🎉`);
      navigate('/home');
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      const status = error.response?.status;
      let message = 'Error inesperado';
      switch (status) {
        case 401:
          message = 'Credenciales incorrectas';
          setErrors({ auth: 'Nombre de usuarie o contraseña incorrectos' });
          break;
        case 400:
          message = 'Completa todos los campos correctamente';
          break;
        case 403:
          message = 'Acceso denegado';
          break;
        case 429:
          message = 'Demasiados intentos';
          break;
        case 500:
          message = 'Servidor inestable';
          break;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginButtonText = isSubmitting
    ? 'Iniciando...'
    : cooldown
    ? 'Esperando...'
    : 'Iniciar Sesión';

  if (showRecovery) {
    return (
      <div className={styles.formContainer}>
        <img src="/logo/urdimbreLogo.png" alt="Logo de Urdimbre" className={styles.logo} />
        <h2 className={styles.welcome}>Recuperar Contraseña</h2>
        <p className={styles.recoveryDescription}>
          Introduce tu email y te enviaremos un enlace para que puedas crear una nueva contraseña.
        </p>

        <div className={styles.recoveryForm}>
          <label className={styles.label} htmlFor="recovery-email">Email de recuperación</label>
          <input
            id="recovery-email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            className={`${styles.input} ${shouldShowError('email') ? styles.inputError : ''}`}
            value={recoveryEmail}
            onChange={handleRecoveryEmailChange}
            onBlur={() => handleBlur('email')}
            disabled={isRecovering}
          />
          {shouldShowError('email') && <p className={styles.error}>{errors.email}</p>}

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => {
                setShowRecovery(false);
                setRecoveryEmail('');
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              disabled={isRecovering}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.recoveryButton}`}
              onClick={handlePasswordRecovery}
              disabled={isRecovering || !recoveryEmail}
            >
              {isRecovering ? 'Enviando...' : 'Enviar Enlace'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <img src="/logo/urdimbreLogo.png" alt="Logo de Urdimbre" className={styles.logo} />
      <h2 className={styles.welcome}>¡Bienvenide, estás en casa!</h2>

      <form onSubmit={handleSubmit} autoComplete="off">
        {errors.auth && <div className={styles.authError}>{errors.auth}</div>}

        <label className={styles.label} htmlFor="username">Nombre de Usuarie</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Introduce tu nombre de usuarie"
          className={`${styles.input} ${shouldShowError('username') ? styles.inputError : ''}`}
          value={formData.username}
          onChange={handleChange}
          onBlur={() => handleBlur('username')}
          autoComplete="username"
          required
          disabled={isSubmitting}
        />
        <p className={styles.hint}>Usa el mismo nombre de usuarie con el que te registraste.</p>
        {shouldShowError('username') && <p className={styles.error}>{errors.username}</p>}

        <label className={styles.label} htmlFor="password">Contraseña</label>
        <div className={styles.passwordContainer}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Introduce tu contraseña"
            className={`${styles.input} ${shouldShowError('password') ? styles.inputError : ''}`}
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <p className={styles.hint}>
          <span>Introduce tu contraseña. </span>
        </p>
        {shouldShowError('password') && <p className={styles.error}>{errors.password}</p>}

        {loginAttempts > 0 && (
          <div className={styles.attemptsWarning}>
            ⚠️ Intentos fallidos: {loginAttempts}/5
            {loginAttempts >= 3 && (
              <span className={styles.recoveryHint}>
                {' '} - <button type="button" className={styles.inlineRecoveryLink} onClick={() => setShowRecovery(true)}>
                  ¿Recuperar contraseña?
                </button>
              </span>
            )}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} ${styles.createButton}`}
            onClick={() => navigate('/register')}
            disabled={isSubmitting}
          >
            Crear Cuenta
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.loginButton}`}
            disabled={isSubmitting || cooldown}
          >
            {loginButtonText}
          </button>
        </div>

        <div className={styles.textCenter}>
          <button type="button" className={styles.forgotPassword} onClick={() => setShowRecovery(true)} disabled={isSubmitting}>
            ¿Has olvidado tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
