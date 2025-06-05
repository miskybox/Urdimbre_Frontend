import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { toast } from 'react-hot-toast';
import styles from './RegisterForm.module.css';

const pronouns = ['Elle', 'Ella', 'El'];

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    pronouns: '',
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

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handlePronounSelect = (selected) => {
    setFormData({ ...formData, pronouns: selected });
    if (errors.pronouns) setErrors({ ...errors, pronouns: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const validCode = 'URDIMBRE2025';

    if (!formData.pronouns) newErrors.pronouns = 'Selecciona un pronombre';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuarie es obligatorio';
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.inviteCode || formData.inviteCode !== validCode)
      newErrors.inviteCode = 'Código de validación inválido o ausente';
    if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'Debes aceptar la política de privacidad';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const backendErrors = error.response?.data?.errors || {};
      setErrors({ ...errors, ...backendErrors });

      const errorMessage = error.response?.data?.message || 'Error al registrar';
      if (error.response?.status === 400) {
        toast.error('Datos inválidos. Revisa los campos marcados.');
      } else if (error.response?.status === 409) {
        toast.error('El usuario o email ya existe. Prueba con otros datos.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
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
          <legend className={styles.label}>Pronombre</legend>
          {pronouns.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pronounButton} ${formData.pronouns === p ? styles.selected : ''}`}
              onClick={() => handlePronounSelect(p)}
            >
              {p}
            </button>
          ))}
        </fieldset>
        {errors.pronouns && <p className={styles.error}>{errors.pronouns}</p>}

        <label htmlFor="username" className={styles.label}>Nombre de Usuarie</label>
        <input id="username" name="username" value={formData.username} onChange={handleChange} className={styles.input} placeholder="Ingrese su nombre de usuarie" />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label htmlFor="firstName" className={styles.label}>Nombre</label>
        <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.input} placeholder="Ingrese su nombre" />
        {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}

        <label htmlFor="lastName" className={styles.label}>Apellido</label>
        <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.input} placeholder="Ingrese su apellido" />
        {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}

        <label htmlFor="email" className={styles.label}>Email</label>
        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder="Ingrese su email" />
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
            placeholder="Ingrese su contraseña"
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
        <small className={styles.hint}>Usa al menos 8 caracteres, con mayúsculas, minúsculas, números y al menos un símbolo.</small>
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label htmlFor="confirmPassword" className={styles.label}>Corrobora tu contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Corrobora tu contraseña"
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

        <label htmlFor="inviteCode" className={styles.label}>Código de Validación</label>
        <input id="inviteCode" name="inviteCode" value={formData.inviteCode} onChange={handleChange} className={styles.input} placeholder="Ingrese el código que recibió" />
        {errors.inviteCode && <p className={styles.error}>{errors.inviteCode}</p>}

       
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={handleChange}
            />
            He leído y acepto la{' '}
            <Link to="/privacy" target="_blank" rel="noopener noreferrer">política de privacidad</Link>.
          </label>
          {errors.acceptPrivacy && <p className={styles.error}>{errors.acceptPrivacy}</p>}

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            Acepto los{' '}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">términos y condiciones</Link>.
          </label>
          {errors.acceptTerms && <p className={styles.error}>{errors.acceptTerms}</p>}
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={() => navigate('/')}>
            Cancelar
          </button>
          <button type="submit" className={`${styles.button} ${styles.createButton}`} disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
