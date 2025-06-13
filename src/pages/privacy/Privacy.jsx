import React from "react";
import styles from "./Privacy.module.css";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Privacy = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/register");
  };

  return (
    <div className={styles.privacy}>
      <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar política de privacidad">
        <FaTimes />
      </button>

      <h1>Política de Privacidad</h1>
      <p>
        En <strong>Urdimbre™</strong>, respetamos tu privacidad y protegemos los datos personales de todes nuestres usuaries, conforme al Reglamento General de Protección de Datos (RGPD).
      </p>

      <h2>¿Qué datos recopilamos?</h2>
      <ul>
        <li>Nombre y correo electrónico (si decidís registrarte)</li>
        <li>Preferencias de navegación</li>
        <li>Información técnica como IP, navegador y sistema operativo</li>
      </ul>

      <h2>¿Para qué usamos estos datos?</h2>
      <p>
        Utilizamos esta información para mejorar tu experiencia, personalizar los contenidos y garantizar la seguridad de nuestres espacios.
      </p>

      <h2>¿Cuáles son tus derechos?</h2>
      <p>
        Tenés derecho a acceder, corregir o eliminar tus datos en cualquier momento. Podés contactarnos a través de <a href="mailto:privacidad@urdimbre.org">privacidad@urdimbre.org</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Este sitio utiliza cookies para mejorar la navegación y analizar el uso de la plataforma. Podés gestionarlas desde tu navegador.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tenés dudas o sugerencias, contacta con nosotres en <a href="mailto:privacidad@urdimbre.org">privacidad@urdimbre.org</a>.
      </p>
    </div>
  );
};

export default Privacy;
