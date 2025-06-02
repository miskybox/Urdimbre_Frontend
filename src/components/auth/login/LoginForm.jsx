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

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ MOSTRAR MENSAJE DE REGISTRO EXITOSO SI VIENE DEL REGISTER
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, { duration: 4000 });
      
      // ✅ PRE-LLENAR USERNAME SI VIENE DEL REGISTRO
      if (location.state?.username) {
        setFormData(prev => ({ ...prev, username: location.state.username }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[<>"']/g, '');
    setFormData({ ...formData, [name]: sanitizedValue });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // ✅ VALIDACIÓN SIMPLE - Solo verificar que no estén vacíos
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuarie es obligatorio';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('🔑 Intentando login con:', { username: formData.username });
      const response = await login(formData);
      
  // ✅ LOGIN EXITOSO - REDIRIGIR A HOME
    toast.success(`¡Bienvenide de vuelta, ${response.username || formData.username}! 🎉`);
    navigate('/'); 
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      const status = error.response?.status;
      
      // ✅ MENSAJES DE ERROR ESPECÍFICOS
      if (status === 401) {
        setErrors({ auth: 'Nombre de usuarie o contraseña incorrectos' });
        toast.error('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      } else if (status === 400) {
        setErrors({ auth: 'Datos de login inválidos' });
        toast.error('Por favor, completa todos los campos correctamente.');
      } else if (status === 403) {
        setErrors({ auth: 'Acceso denegado' });
        toast.error('Tu cuenta podría estar desactivada. Contacta al soporte.');
      } else if (status >= 500) {
        toast.error('Error del servidor. Intenta nuevamente en unos minutos.');
      } else {
        toast.error(error.response?.data?.message || 'Error al iniciar sesión');
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

        <p className={styles.hint}>
          Introduce la contraseña que usaste al registrarte.
        </p>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;