import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../../components/auth/login/LoginForm';
import useAuth from '../../hooks/useAuth.js';
import styles from './LoginPage.module.css';

const LoginPage = () => {
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
        <h1 className={styles.title}>Bienvenide a Urdimbre</h1>
        <p className={styles.subtitle}>
          Inicia sesión para conectarte con la comunidad.
        </p>
      </div>
      <LoginForm />
      <div className={styles.footer}>
        <Link to="/">← Volver a la página principal</Link>
      </div>
    </div>
  );
};

export default LoginPage;