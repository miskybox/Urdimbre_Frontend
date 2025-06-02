import ActivityCalendar from '../../components/calendar/ActivityCalendar';
import styles from './CalendarPage.module.css';

const CalendarPage = () => {
  return (
    <div className={styles.pageContainer}>
      <ActivityCalendar />
    </div>
  );
};

export default CalendarPage;