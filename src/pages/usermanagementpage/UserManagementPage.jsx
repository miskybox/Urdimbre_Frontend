import UserTable from '../../components/admin/UserTable';
import styles from './UserManagementPage.module.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Cerrar gestión de usuarios y volver al inicio"
      >
        <FaTimes />
      </button>
      <div className={styles.content}>
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagementPage;
