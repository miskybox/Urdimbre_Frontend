// ActivityCalendar.jsx
import { useState, useEffect, useCallback } from 'react';
import styles from './ActivityCalendar.module.css';

const ActivityCalendar = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [reservationStatus, setReservationStatus] = useState({}); // Track reservation status per activity

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Sample activities data - in real app this would come from API
  const activitiesData = {
    // Activities by date key (YYYY-MM-DD format)
    '2025-05-29': [
      {
        id: 'cycling-29-1530',
        time: '15:30',
        duration: '45 min',
        title: 'CYCLING',
        instructor: 'CRISTOBAL',
        location: 'DUIN Can Zam',
        availableSpots: 23,
        totalSpots: 30,
        category: 'cycling',
        description: 'Clase de cycling de alta intensidad para mejorar la resistencia cardiovascular y tonificar las piernas.',
        image: '/api/placeholder/400/200'
      },
      {
        id: 'aqua-29-1530',
        time: '15:30',
        duration: '45 min',
        title: 'AGUA MIX',
        instructor: 'PAULA',
        location: 'DUIN Can Zam',
        availableSpots: 17,
        totalSpots: 25,
        category: 'aqua',
        description: 'Ejercicios acuáticos que combinan cardio y tonificación en un ambiente divertido y refrescante.',
        image: '/api/placeholder/400/200'
      },
      {
        id: 'bodypump-29-1530',
        time: '15:30',
        duration: '50 min',
        title: 'BODY PUMP',
        instructor: 'KEVIN',
        location: 'DUIN Can Zam',
        availableSpots: 3,
        totalSpots: 20,
        category: 'strength',
        description: 'Entrenamiento con barras y pesas para tonificar y fortalecer todo el cuerpo.',
        image: '/api/placeholder/400/200'
      },
      {
        id: 'gymgold-29-1630',
        time: '16:30',
        duration: '45 min',
        title: 'GYM GOLD',
        instructor: 'KEVIN',
        location: 'DUIN Can Zam',
        availableSpots: 27,
        totalSpots: 30,
        category: 'gym',
        description: 'Rutina de entrenamiento premium con ejercicios avanzados para usuarios experimentados.',
        image: '/api/placeholder/400/200'
      }
    ],
    '2025-05-30': [
      {
        id: 'yoga-30-0900',
        time: '09:00',
        duration: '60 min',
        title: 'YOGA FLOW',
        instructor: 'SARA',
        location: 'DUIN Can Zam',
        availableSpots: 8,
        totalSpots: 15,
        category: 'yoga',
        description: 'Secuencias fluidas de yoga para mejorar la flexibilidad, fuerza y relajación.',
        image: '/api/placeholder/400/200'
      },
      {
        id: 'tonificacion-30-0800',
        time: '08:00',
        duration: '45 min',
        title: 'TONIFICACION',
        instructor: 'SONIA',
        location: 'DUIN Can Zam (CZ ESTUDIO 1)',
        availableSpots: 24,
        totalSpots: 30,
        category: 'strength',
        description: 'Clase de tonificación muscular enfocada en fortalecer y definir todos los grupos musculares principales.',
        image: '/api/placeholder/400/200'
      },
      {
        id: 'zumba-30-1800',
        time: '18:00',
        duration: '45 min',
        title: 'ZUMBA',
        instructor: 'MARÍA',
        location: 'DUIN Can Zam',
        availableSpots: 1,
        totalSpots: 25,
        category: 'dance',
        description: 'Baile fitness que combina movimientos latinos con ejercicio cardiovascular.',
        image: '/api/placeholder/400/200'
      }
    ],
    '2025-05-31': [
      {
        id: 'pilates-31-1000',
        time: '10:00',
        duration: '90 min',
        title: 'PILATES AVANZADO',
        instructor: 'CLAUDIA',
        location: 'DUIN Can Zam',
        availableSpots: 12,
        totalSpots: 15,
        category: 'pilates',
        description: 'Clase avanzada de pilates para mejorar la fuerza del core y la estabilidad.',
        image: '/api/placeholder/400/200'
      }
    ]
  };

  const getActivitiesForDate = useCallback((date) => {
    const dateKey = date.toISOString().split('T')[0];
    return activitiesData[dateKey] || [];
  }, [activitiesData]);

  const isSameDay = useCallback((date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }, []);

  const getSpotsColor = useCallback((available, total) => {
    const percentage = available / total;
    if (percentage > 0.7) return styles.spotsHigh;
    if (percentage > 0.2) return styles.spotsMedium;
    return styles.spotsLow;
  }, []);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, []);

  const formatSelectedDate = useCallback((date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  }, []);

  // Generate calendar days for current month
  const generateCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasActivities = getActivitiesForDate(date).length > 0;
      days.push({
        date: date,
        day: day,
        hasActivities: hasActivities,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    return days;
  }, [currentMonth, getActivitiesForDate, isSameDay, selectedDate]);

  // Get week days for horizontal scroll
  const getWeekDays = useCallback(() => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1); // Monday as first day
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        number: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        date: date,
        isSelected: isSameDay(date, selectedDate),
        isToday: isSameDay(date, new Date())
      });
    }
    return days;
  }, [selectedDate, isSameDay]);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  }, []);

  const handleMonthChange = useCallback((direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const handleActivityClick = useCallback((activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  }, []);

  const handleActivityKeyDown = useCallback((event, activity) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActivityClick(activity);
    }
  }, [handleActivityClick]);

  const handleReserveClass = useCallback((activityId) => {
    // Update reservation status
    setReservationStatus(prev => ({
      ...prev,
      [activityId]: 'processing'
    }));

    // Simulate API call
    setTimeout(() => {
      setReservationStatus(prev => ({
        ...prev,
        [activityId]: 'confirmed'
      }));
      
      // Update available spots
      const dateKey = selectedDate.toISOString().split('T')[0];
      if (activitiesData[dateKey]) {
        const activityIndex = activitiesData[dateKey].findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
          activitiesData[dateKey][activityIndex].availableSpots -= 1;
        }
      }
      
      // Close modal after showing confirmation
      setTimeout(() => {
        setShowActivityModal(false);
        setSelectedActivity(null);
      }, 2000);
    }, 1500);
  }, [selectedDate, activitiesData]);

  const handleCloseModal = useCallback(() => {
    setShowActivityModal(false);
    setSelectedActivity(null);
  }, []);

  const handleModalKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  const isActivityReserved = useCallback((activityId) => {
    return reservationStatus[activityId] === 'confirmed';
  }, [reservationStatus]);

  const isActivityProcessing = useCallback((activityId) => {
    return reservationStatus[activityId] === 'processing';
  }, [reservationStatus]);

  // Helper function to get calendar day classes
  const getCalendarDayClasses = useCallback((dayData) => {
    if (!dayData) return styles.calendarDayEmpty;
    
    let classes = styles.calendarDay;
    if (dayData.isSelected) classes += ` ${styles.calendarDaySelected}`;
    if (dayData.isToday) classes += ` ${styles.calendarDayToday}`;
    if (dayData.hasActivities) classes += ` ${styles.calendarDayHasActivities}`;
    
    return classes;
  }, []);

  // Helper function to render spots info
  const renderSpotsInfo = useCallback((activity) => {
    if (isActivityReserved(activity.id)) {
      return <span className={styles.reservedBadge}>Reservado</span>;
    }
    
    return (
      <>
        <span className={`${styles.spotsText} ${getSpotsColor(activity.availableSpots, activity.totalSpots)}`}>
          Quedan {activity.availableSpots} plazas
        </span>
        <div className={`${styles.spotsIndicator} ${getSpotsColor(activity.availableSpots, activity.totalSpots)}`}></div>
      </>
    );
  }, [isActivityReserved, getSpotsColor]);

  // Helper function to render reserve button
  const renderReserveButton = useCallback((activity) => {
    const isProcessing = isActivityProcessing(activity.id);
    const isDisabled = activity.availableSpots === 0 || isProcessing;
    
    let buttonText = 'Reservar clase';
    if (isProcessing) buttonText = 'Procesando...';
    else if (activity.availableSpots === 0) buttonText = 'Clase completa';
    
    return (
      <button 
        className={`${styles.modalReserveButton} ${isProcessing ? styles.processing : ''}`}
        onClick={() => handleReserveClass(activity.id)}
        disabled={isDisabled}
      >
        {isProcessing && <div className={styles.buttonSpinner}></div>}
        {buttonText}
      </button>
    );
  }, [isActivityProcessing, handleReserveClass]);

  const weekDays = getWeekDays();
  const currentActivities = getActivitiesForDate(selectedDate);
  const filteredActivities = activeFilter === 'all' 
    ? currentActivities 
    : currentActivities.filter(activity => activity.category === activeFilter);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>Clases</h1>
        <div className={styles.headerRight}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
        </div>
      </header>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <button className={styles.filtersButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Filtros
        </button>
        
        <button className={styles.locationButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 21.7C17.3 17 20 13 20 10A8 8 0 0 0 4 10C4 13 6.7 17 12 21.7Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <div className={styles.filterTabs}>
          <button 
            className={`${styles.tabButton} ${activeFilter === 'all' ? styles.tabActive : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todas las clases
          </button>
          <button 
            className={`${styles.tabButton} ${activeFilter === 'favorites' ? styles.tabActive : ''}`}
            onClick={() => setActiveFilter('favorites')}
          >
            1 Club favorito
          </button>
        </div>
      </div>

      {/* Weekly calendar */}
      <div className={styles.weeklyCalendar}>
        {weekDays.map((day) => (
          <button
            key={`${day.year}-${day.month}-${day.number}`}
            className={`${styles.dayButton} ${day.isSelected ? styles.dayActive : ''} ${day.isToday ? styles.dayToday : ''}`}
            onClick={() => handleDateSelect(day.date)}
          >
            <span className={styles.dayName}>{day.name}</span>
            <span className={styles.dayNumber}>{day.number}</span>
            {day.isSelected && <div className={styles.dayIndicator}></div>}
            {getActivitiesForDate(day.date).length > 0 && !day.isSelected && (
              <div className={styles.dayHasActivities}></div>
            )}
          </button>
        ))}
        
        <button 
          className={styles.calendarToggle}
          onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            className={isCalendarExpanded ? styles.rotated : ''}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Expandable Full Calendar */}
      {isCalendarExpanded && (
        <div className={styles.fullCalendar}>
          <div className={styles.calendarHeader}>
            <button onClick={() => handleMonthChange(-1)} className={styles.monthButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <h3 className={styles.monthTitle}>
              {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => handleMonthChange(1)} className={styles.monthButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
          
          <div className={styles.weekDaysHeader}>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
              <div key={day} className={styles.weekDayLabel}>{day}</div>
            ))}
          </div>
          
          <div className={styles.calendarGrid}>
            {generateCalendarDays().map((dayData, index) => (
              <button
                key={dayData ? `${dayData.date.getTime()}-${dayData.day}` : `empty-${index}`}
                className={getCalendarDayClasses(dayData)}
                onClick={() => dayData && handleDateSelect(dayData.date)}
                disabled={!dayData}
              >
                {dayData && (
                  <>
                    <span className={styles.calendarDayNumber}>{dayData.day}</span>
                    {dayData.hasActivities && (
                      <div className={styles.calendarDayDot}></div>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected date */}
      <div className={styles.selectedDate}>
        <h2>{formatSelectedDate(selectedDate)}</h2>
        {currentActivities.length > 0 && (
          <span className={styles.activityCount}>
            {currentActivities.length} actividad{currentActivities.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Activities list */}
      <div className={styles.activitiesList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <button 
              key={activity.id} 
              className={styles.activityCard}
              onClick={() => handleActivityClick(activity)}
              onKeyDown={(e) => handleActivityKeyDown(e, activity)}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalles de ${activity.title}`}
            >
              <div className={styles.activityTime}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{activity.time} • {activity.duration}</span>
              </div>

              <div className={styles.activityInfo}>
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <p className={styles.activityInstructor}>con {activity.instructor}</p>
                <p className={styles.activityLocation}>{activity.location}</p>
              </div>

              <div className={styles.spotsInfo}>
                {renderSpotsInfo(activity)}
              </div>
            </button>
          ))
        ) : (
          <div className={styles.noActivities}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay actividades programadas</h3>
            <p>Selecciona otro día para ver más clases disponibles</p>
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {showActivityModal && selectedActivity && (
        <div 
          className={styles.modalOverlay} 
          onClick={handleCloseModal}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          <div className={styles.activityModal} onClick={(e) => e.stopPropagation()}>
            {/* Header with background image */}
            <div className={styles.modalHeader}>
              <button className={styles.modalBackButton} onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={styles.modalHeaderImage}>
                <img src={selectedActivity.image} alt={selectedActivity.title} />
                <div className={styles.modalHeaderOverlay}></div>
              </div>
            </div>

            {/* Content */}
            <div className={styles.modalContent}>
              <div className={styles.modalClassHeader}>
                <h1 id="modal-title" className={styles.modalClassTitle}>{selectedActivity.title}</h1>
                <div className={styles.modalSpotsInfo}>
                  {renderSpotsInfo(selectedActivity)}
                </div>
              </div>

              <p className={styles.modalClassStatus}>
                {isActivityReserved(selectedActivity.id) ? 'Reservado' : 'Disponible para reservar'}
              </p>

              {/* Schedule section */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Cronograma</h3>
                <div className={styles.modalScheduleInfo}>
                  <div className={styles.modalScheduleDate}>
                    <span className={styles.modalDayName}>{formatSelectedDate(selectedDate).split(' ')[0]}</span>
                    <span className={styles.modalDayNumber}>{selectedDate.getDate()}</span>
                  </div>
                  <div className={styles.modalScheduleDetails}>
                    <div className={styles.modalTimeInfo}>
                      <span className={styles.modalTimeRange}>{selectedActivity.time} Europe/Madrid</span>
                      <div className={styles.modalDuration}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{selectedActivity.duration}</span>
                      </div>
                    </div>
                    <button className={styles.modalCalendarButton}>
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
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Ubicación</h3>
                <div className={styles.modalLocationInfo}>
                  <span className={styles.modalLocationName}>{selectedActivity.location}</span>
                  <button className={styles.modalDirectionButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Instructor section */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Instructor</h3>
                <p className={styles.modalInstructorName}>{selectedActivity.instructor}</p>
              </div>

              {/* Description section */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Descripción de la clase</h3>
                <p className={styles.modalDescription}>{selectedActivity.description}</p>
              </div>

              {/* Reservation Status or Button */}
              {reservationStatus[selectedActivity.id] === 'confirmed' ? (
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
                <div className={styles.modalReserveSection}>
                  {renderReserveButton(selectedActivity)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;