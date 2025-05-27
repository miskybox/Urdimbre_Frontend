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
      <div className={styles.header}>
        <Link to="/">
          <img src="/src/assets/animacion-imago-creatura.gif" alt="Urdimbre-creatura" className={styles.logo} />
        </Link>
        <h1 className={styles.title}>Únete a Urdimbre</h1>
        <p className={styles.subtitle}>
          Crea tu cuenta para acceder a todas las funciones de Urdimbre.
        </p>
      </div>
      <RegisterForm />
      <div className={styles.footer}>
        <Link to="/">← Volver a la página principal</Link>
      </div>
    </div>
  );
};

export default RegisterPage;