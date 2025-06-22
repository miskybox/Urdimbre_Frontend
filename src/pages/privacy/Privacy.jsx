import React from "react";
import styles from "./Privacy.module.css";
import { FaTimes } from "react-icons/fa";

const Privacy = () => {
  const handleClose = () => {
    window.close();
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
        <li>Nombre y correo electrónico (si decides registrarte)</li>
        <li>Preferencias de navegación</li>
        <li>Información técnica como IP, navegador y sistema operativo</li>
      </ul>

      <h2>¿Para qué usamos estos datos?</h2>
      <p>Utilizamos esta información para mejorar tu experiencia, personalizar los contenidos y garantizar la seguridad de nuestres espacios.</p>

      <h2>Base legal del tratamiento</h2>
      <p>La base legal para el tratamiento de tus datos personales es tu consentimiento informado, libre y específico.</p>

      <h2>Tiempo de conservación</h2>
      <p>Conservaremos tus datos mientras seas usuarie activx de la plataforma o hasta que solicites su eliminación.</p>

      <h2>Confidencialidad y uso de imagen</h2>
      <p>Toda la información relacionada con tu identidad de género, orientación sexual o cualquier otro dato sensible será tratada de forma confidencial. El uso de tu imagen está estrictamente prohibido sin tu consentimiento explícito.</p>

      <h2>¿Cuáles son tus derechos?</h2>
      <p>Tienes derecho a acceder, corregir o eliminar tus datos en cualquier momento. Puedes contactarnos a través de <a href="mailto:privacidad@urdimbre.org">privacidad@urdimbre.org</a>.</p>

      <h2>Cookies</h2>
      <p>Este sitio utiliza cookies para mejorar la navegación y analizar el uso de la plataforma. Puedes gestionarlas desde tu navegador.</p>

      <h2>Contacto</h2>
      <p>Si tienes dudas o sugerencias, escríbenos a <a href="mailto:urdimbretrans@gmail.com">privacidad@urdimbre.org</a>.</p>
    </div>
  );
};

export default Privacy;