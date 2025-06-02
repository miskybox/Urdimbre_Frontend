import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/register/RegisterForm';
import useAuth from '../../hooks/useAuth.js';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <RegisterForm />
        <div className={styles.footer}>
          <Link to="/">← Volver a la página principal</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
