import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { toast } from 'react-hot-toast';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', inviteCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const validCode = 'URDIMBRE2025';

    if (!formData.inviteCode || formData.inviteCode !== validCode)
      newErrors.inviteCode = 'Código de invitación inválido o ausente';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuarie es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const userData = { ...formData };
    delete userData.confirmPassword;

    try {
      await register(userData);
      await login({ username: formData.username, password: formData.password });
      toast.success(`¡Registro exitoso! Bienvenide ${formData.username}`);
      navigate('/');
    } catch (error) {
      const backendErrors = error.response?.data?.errors || {};
      setErrors({ ...errors, ...backendErrors });
      toast.error(error.response?.data?.message || 'Error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Crear una cuenta</h2>
      <form onSubmit={handleSubmit}>

        <label htmlFor="inviteCode" className={styles.label}>Código de invitación</label>
        <input id="inviteCode" type="text" required pattern="URDIMBRE2025" title="Introduce un código de invitación válido" name="inviteCode" value={formData.inviteCode} onChange={handleChange} className={styles.input} />
        {errors.inviteCode && <p className={styles.error}>{errors.inviteCode}</p>}

        <label htmlFor="firstName" className={styles.label}>Nombre</label>
        <input id="firstName" type="text" required pattern="^[A-Za-zÀ-ÿ\s]+$" title="Introduce solo letras" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.input} />
        {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}

        <label htmlFor="lastName" className={styles.label}>Apellido</label>
        <input id="lastName" type="text" required pattern="^[A-Za-zÀ-ÿ\s]+$" title="Introduce solo letras" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.input} />
        {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}

        <label htmlFor="username" className={styles.label}>Usuario</label>
        <input id="username" type="text" required pattern="^[a-zA-Z0-9._-]{3,}$" title="Mínimo 3 caracteres. Solo letras, números, puntos, guiones y guiones bajos." autoComplete="username" name="username" value={formData.username} onChange={handleChange} className={styles.input} />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label htmlFor="email" className={styles.label}>Correo electrónico</label>
        <input id="email" type="email" required autoComplete="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label htmlFor="password" className={styles.label}>Contraseña</label>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? '🙈' : '👁️'}
        </button>
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label htmlFor="confirmPassword" className={styles.label}>Confirmar contraseña</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? '🙈' : '👁️'}
        </button>
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;