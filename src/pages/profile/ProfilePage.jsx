import { useState } from 'react';
import styles from './ProfilePage.module.css';

const pronouns = ['Elle', 'Ella', 'El'];

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    pronouns: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    bio: '',
    profileImage: null,
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePronounSelect = (selected) => {
    setFormData({ ...formData, pronouns: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔄 Datos actualizados:', formData);

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí irá la lógica de envío al backend
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.title}>Editar Perfil</h2>

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

        <label htmlFor="username" className={styles.label}>Nombre de Usuarie</label>
        <input id="username" name="username" className={styles.input} value={formData.username} onChange={handleChange} />

        <label htmlFor="firstName" className={styles.label}>Nombre</label>
        <input id="firstName" name="firstName" className={styles.input} value={formData.firstName} onChange={handleChange} />

        <label htmlFor="lastName" className={styles.label}>Apellido</label>
        <input id="lastName" name="lastName" className={styles.input} value={formData.lastName} onChange={handleChange} />

        <label htmlFor="email" className={styles.label}>Email</label>
        <input id="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} type="email" />

        <label htmlFor="location" className={styles.label}>Ubicación</label>
        <input id="location" name="location" className={styles.input} value={formData.location} onChange={handleChange} />

        <label htmlFor="bio" className={styles.label}>Biografía</label>
        <textarea id="bio" name="bio" className={styles.input} rows="4" value={formData.bio} onChange={handleChange} />

        <label htmlFor="profileImage" className={styles.label}>Imagen de perfil</label>
        <input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleChange} className={styles.input} />

        <label htmlFor="newPassword" className={styles.label}>Nueva contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="newPassword"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Escribe tu nueva contraseña"
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
        <small className={styles.hint}>Mínimo 8 caracteres, incluye mayúsculas, números y un símbolo.</small>

        <label htmlFor="confirmNewPassword" className={styles.label}>Confirma la nueva contraseña</label>
        <div className={styles.inputGroup}>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Confirma tu nueva contraseña"
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

        <div className={styles.buttonContainer}>
          <button type="submit" className={`${styles.button} ${styles.createButton}`}>
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
