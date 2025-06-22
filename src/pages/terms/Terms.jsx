
import React from 'react';
import MainLayout from '../../components/mainLayout/MainLayout';
import styles from './Terms.module.css';
import { FaTimes } from 'react-icons/fa';

const Terms = () => {
  const handleClose = () => {
    window.close();
  };

  return (
    <MainLayout>
      <section className={styles.termsContainer}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Cerrar términos y volver al registro"
          title="Cerrar"
        >
          <FaTimes />
        </button>

        <h1>Términos y Condiciones de Uso</h1>
        <p>Al registrarte y utilizar la plataforma Urdimbre, aceptas los siguientes términos y condiciones. Por favor, léelos atentamente.</p>

        <h2>1. Finalidad de la Plataforma</h2>
        <p>Urdimbre es una plataforma comunitaria que promueve espacios seguros, inclusivos y colaborativos para personas trans, no binarias e intersex. Su uso está destinado exclusivamente a fines informativos, sociales y participativos dentro de la comunidad.</p>

        <h2>2. Responsabilidades de les Usuaries</h2>
        <ul>
          <li>Respetar a todes les participantes y sus identidades, sin discriminación ni violencia.</li>
          <li>No compartir contenido ofensivo, violento o discriminatorio.</li>
          <li>No utilizar la plataforma con fines comerciales sin autorización expresa.</li>
          <li>Participar activamente en las actividades de la plataforma, si así lo desea, conforme a los principios de colaboración y bienestar común.</li>
          <li>Respetar la confidencialidad de toda la información compartida en la comunidad.</li>
        </ul>

        <h2>3. Normas de Convivencia y Confidencialidad</h2>
        <p>No se tolerará ningún tipo de acoso, intimidación o comportamiento violento. Toda la información personal, identidad de género u orientación sexual será tratada con confidencialidad. El uso de imágenes sin consentimiento está expresamente prohibido.</p>

        <h2>4. Protección de Datos</h2>
        <p>Nos comprometemos a proteger tus datos personales conforme al RGPD. Consulta nuestra <a href="/privacy" target="_blank">política de privacidad</a> para más detalles.</p>

        <h2>5. Modificaciones</h2>
        <p>Urdimbre se reserva el derecho de modificar estos términos. En caso de cambios importantes, se notificará debidamente a les usuaries registrades.</p>

        <h2>6. Consecuencias por Incumplimiento</h2>
        <p>El incumplimiento de estos términos puede conllevar la baja de la asociación o la suspensión del acceso a la plataforma, según lo establecido en los estatutos internos.</p>

        <h2>7. Contacto</h2>
        <p>Para cualquier consulta relacionada con estos términos, puedes escribirnos a contacto@urdimbre.org.</p>
      </section>
    </MainLayout>
  );
};

export default Terms;