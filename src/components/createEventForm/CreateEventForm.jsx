import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import styles from './CreateEventForm.module.css';
import activityService from '../../services/activityService';

const CreateEventForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
    date: '',
    startTime: '',
    endTime: '',
    maxAttendees: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sanitize = (value) => {
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (!formData.language) newErrors.language = 'Selecciona un idioma';
    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    if (!formData.startTime) newErrors.startTime = 'Indica la hora de inicio';
    if (!formData.endTime) newErrors.endTime = 'Indica la hora de fin';
    if (!formData.maxAttendees || isNaN(formData.maxAttendees)) newErrors.maxAttendees = 'Indica el aforo máximo';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitize(value),
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const translateCategory = (value) => {
    switch (value) {
      case 'arte': return 'ARTISTIC';
      case 'deporte': return 'SPORT';
      case 'ocio': return 'LEISURE';
      default: return value.toUpperCase();
    }
  };

  const translateLanguage = (value) => {
    switch (value) {
      case 'es': return 'SPANISH';
      case 'ca': return 'CATALAN';
      case 'en': return 'ENGLISH';
      default: return value.toUpperCase();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: translateCategory(formData.category),
      language: translateLanguage(formData.language),
      date: formData.date,
      startTime: formData.startTime + ':00',
      endTime: formData.endTime + ':00',
      maxAttendees: parseInt(formData.maxAttendees, 10)
    };

    try {
      await activityService.createActivity(payload);
      setSuccessMessage('🎉 ¡Evento creado con éxito!');
      setFormData({
        title: '',
        description: '',
        category: '',
        language: '',
        date: '',
        startTime: '',
        endTime: '',
        maxAttendees: ''
      });
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorMessage('No tienes permisos para crear actividades.');
      } else {
        setErrorMessage('Error del servidor. Intenta de nuevo más tarde.');
      }
    }
  };

  const handleClose = () => {
    navigate('/home');
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit} noValidate>
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Cerrar formulario"
      >
        <FaTimes />
      </button>

      <h2 className={styles.formTitle}>Crear nuevo evento</h2>
      <p className={styles.formDescription}>
        Rellena el siguiente formulario para añadir tu actividad a Urdimbre.
      </p>

      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="title">Título</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción</label>
        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="category">Categoría</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="arte">Arte</option>
            <option value="deporte">Deporte</option>
            <option value="ocio">Ocio</option>
          </select>
          {errors.category && <span className={styles.error}>{errors.category}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="language">Idioma</label>
          <select id="language" name="language" value={formData.language} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="es">Español</option>
            <option value="ca">Català</option>
            <option value="en">Inglés</option>
          </select>
          {errors.language && <span className={styles.error}>{errors.language}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Fecha</label>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
        {errors.date && <span className={styles.error}>{errors.date}</span>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="startTime">Hora de inicio</label>
          <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} />
          {errors.startTime && <span className={styles.error}>{errors.startTime}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime">Hora de fin</label>
          <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} />
          {errors.endTime && <span className={styles.error}>{errors.endTime}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="maxAttendees">Aforo máximo</label>
        <input type="number" id="maxAttendees" name="maxAttendees" value={formData.maxAttendees} onChange={handleChange} />
        {errors.maxAttendees && <span className={styles.error}>{errors.maxAttendees}</span>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Crear evento
      </button>
    </form>
  );
};

export default CreateEventForm;
