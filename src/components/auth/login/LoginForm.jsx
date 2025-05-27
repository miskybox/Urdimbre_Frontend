import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuarie es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
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
        setErrors({ auth: 'Usuarie o contraseña incorrectos' });
      } else {
        toast.error(error.response?.data?.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        {errors.auth && <div className={styles.error}>{errors.auth}</div>}

        <label className={styles.label} htmlFor="username">Usuarie</label>
        <input
          id="username"
          name="username"
          type="text"
          className={styles.input}
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label className={styles.label} htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? '🙈' : '👁️'}
        </button>
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className={styles.textCenter}>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </div>
  );
};

export default LoginForm;