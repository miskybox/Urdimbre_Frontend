// ClassDetail.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ClassDetail.module.css';

const ClassDetail = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationStatus, setReservationStatus] = useState('available'); // available, reserved, confirmed

 
  const classData = {
    id: classId || '1',
    title: 'TONIFICACION',
    instructor: 'SONIA',
    location: 'DUIN Can Zam (CZ ESTUDIO 1)',
    date: 'vie',
    dayNumber: '30',
    time: '8:00 - 8:45',
    timezone: 'Europe/Madrid',
    duration: '45 min',
    availableSpots: 24,
    totalSpots: 30,
    status: 'Disponible para reservar',
    description: 'Clase de tonificación muscular enfocada en fortalecer y definir todos los grupos musculares principales. Combina ejercicios con peso corporal y material específico para lograr una musculatura firme y tonificada.',
    image: '/api/placeholder/400/200',
    category: 'strength'
  };

  const getSpotsColor = (available, total) => {
    const percentage = available / total;
    if (percentage > 0.7) return styles.spotsHigh;
    if (percentage > 0.2) return styles.spotsMedium;
    return styles.spotsLow;
  };

  const handleReserveClass = () => {
    setShowReservationModal(true);
    

    setTimeout(() => {
      setReservationStatus('confirmed');
    }, 1500);
  };

  const handleBackToCalendar = () => {
    navigate('/calendar');
  };

  const handleCloseModal = () => {
    setShowReservationModal(false);
    if (reservationStatus === 'confirmed') {
      navigate('/calendar');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header with background image */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackToCalendar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.headerImage}>
          <img src={classData.image} alt={classData.title} />
          <div className={styles.headerOverlay}></div>
        </div>
      </div>

      {/* Class info card */}
      <div className={styles.classCard}>
        <div className={styles.classHeader}>
          <h1 className={styles.classTitle}>{classData.title}</h1>
          <div className={styles.spotsInfo}>
            <span className={`${styles.spotsText} ${getSpotsColor(classData.availableSpots, classData.totalSpots)}`}>
              Quedan {classData.availableSpots} plazas
            </span>
            <div className={`${styles.spotsIndicator} ${getSpotsColor(classData.availableSpots, classData.totalSpots)}`}></div>
          </div>
        </div>

        <p className={styles.classStatus}>{classData.status}</p>

        {/* Schedule section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cronograma</h3>
          <div className={styles.scheduleInfo}>
            <div className={styles.scheduleDate}>
              <span className={styles.dayName}>{classData.date}</span>
              <span className={styles.dayNumber}>{classData.dayNumber}</span>
            </div>
            <div className={styles.scheduleDetails}>
              <div className={styles.timeInfo}>
                <span className={styles.timeRange}>{classData.time} {classData.timezone}</span>
                <div className={styles.duration}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{classData.duration}</span>
                </div>
              </div>
              <button className={styles.calendarButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Location section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Ubicación</h3>
          <div className={styles.locationInfo}>
            <span className={styles.locationName}>{classData.location}</span>
            <button className={styles.directionButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Instructor section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Instructor</h3>
          <p className={styles.instructorName}>{classData.instructor}</p>
        </div>

        {/* Description section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Descripción de la clase</h3>
          <p className={styles.description}>{classData.description}</p>
        </div>
      </div>

      {/* Reserve button */}
      <div className={styles.reserveSection}>
        <button 
          className={styles.reserveButton}
          onClick={handleReserveClass}
          disabled={classData.availableSpots === 0}
        >
          {classData.availableSpots === 0 ? 'Clase completa' : 'Reservar clase'}
        </button>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {reservationStatus === 'confirmed' ? (
              <div className={styles.confirmationContent}>
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12L11 14L15 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.confirmationTitle}>Reserva confirmada</h2>
                <p className={styles.confirmationMessage}>
                  Te inscribiste con éxito en esta sesión.<br />
                  ¡Disfruta tu entrenamiento!
                </p>
                <button className={styles.confirmationButton} onClick={handleCloseModal}>
                  Listo
                </button>
              </div>
            ) : (
              <div className={styles.loadingContent}>
                <div className={styles.loadingSpinner}></div>
                <p>Procesando reserva...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetail;