import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { toast } from 'react-hot-toast';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(false);

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
      toast.error('Demasiados intentos. Espera 30 segundos.');
      const timer = setTimeout(() => {
        setLoginAttempts(0);
        setCooldown(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[<>"']/g, '');
    setFormData({ ...formData, [name]: sanitizedValue });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuarie es obligatorio';
    }

    const passwordRegex = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      if (status === 401) {
        setErrors({ auth: 'Nombre de usuarie o contraseña incorrectos' });
        toast.error('Credenciales incorrectas.');
      } else if (status === 400) {
        setErrors({ auth: 'Datos de login inválidos' });
        toast.error('Completa todos los campos correctamente.');
      } else if (status === 403) {
        setErrors({ auth: 'Acceso denegado' });
        toast.error('Tu cuenta podría estar inactiva.');
      } else if (status >= 500) {
        toast.error('Servidor inestable. Intenta más tarde.');
      } else {
        toast.error('Error inesperado al iniciar sesión.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <img src="/logo/urdimbreLogo.png" alt="Logo de Urdimbre" className={styles.logo} />
      <h2 className={styles.welcome}>¡Bienvenide, estás en casa!</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {errors.auth && <div className={styles.error}>{errors.auth}</div>}

        <label className={styles.label} htmlFor="username">Nombre de Usuarie</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Introduce tu nombre de usuarie"
          className={styles.input}
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
          disabled={isSubmitting}
        />
        <p className={styles.hint}>Usa el mismo nombre de usuarie con el que te registraste.</p>
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label className={styles.label} htmlFor="password">Contraseña</label>
        <div className={styles.passwordContainer}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Introduce tu contraseña"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
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

        <p className={styles.hint}>Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.</p>
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} ${styles.createButton}`}
            onClick={() => navigate('/register')}
          >
            Crear Cuenta
          </button>

          <button
            type="submit"
            className={`${styles.button} ${styles.loginButton}`}
            disabled={isSubmitting || cooldown}
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
