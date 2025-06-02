import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[<>"']/g, '');
    setFormData({ ...formData, [name]: sanitizedValue });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!formData.username.trim()) {
      newErrors.username = 'El email es obligatorio';
    }

    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y un símbolo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await login(formData);
      toast.success('¡Has iniciado sesión con éxito!');
      navigate('/');
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        setErrors({ auth: 'Email o contraseña incorrectos' });
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

        <label className={styles.label} htmlFor="username">Email</label>
        <input
          id="username"
          name="username"
          type="email"
          placeholder="Introduce tu email"
          className={styles.input}
          value={formData.username}
          onChange={handleChange}
          autoComplete="email"
          required
          disabled={isSubmitting}
        />
        <p className={styles.hint}>Tu email está seguro con nosotres.</p>
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
            minLength={8}
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
          Usa al menos 8 caracteres, con mayúsculas, minúsculas, números y al menos un símbolo.
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
