import UserTable from '../../components/admin/UserTable';
import styles from './UserManagementPage.module.css';

const UserManagementPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagementPage;