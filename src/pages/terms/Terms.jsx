import React from 'react';
import MainLayout from '../../components/mainLayout/MainLayout';
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <MainLayout>
      <section className={styles.termsContainer}>
        <h1>Términos y Condiciones de Uso</h1>

        <p>
          Al registrarte y utilizar la plataforma Urdimbre, aceptas los siguientes términos y condiciones. Por favor, léelos atentamente.
        </p>

        <h2>1. Finalidad de la Plataforma</h2>
        <p>
          Urdimbre es una plataforma comunitaria que promueve espacios seguros, inclusivos y colaborativos para personas trans, no binarias e intersex. Su uso está destinado exclusivamente a fines informativos, sociales y participativos dentro de la comunidad.
        </p>

        <h2>2. Responsabilidades de les usuaries</h2>
        <ul>
          <li>Respetar a todes les participantes y sus identidades.</li>
          <li>No compartir contenido ofensivo, violento o discriminatorio.</li>
          <li>No utilizar la plataforma con fines comerciales sin autorización.</li>
        </ul>

        <h2>3. Protección de Datos</h2>
        <p>
          Nos comprometemos a proteger tus datos personales conforme al RGPD. Consulta nuestra <a href="/privacy" target="_blank">política de privacidad</a> para más detalles.
        </p>

        <h2>4. Modificaciones</h2>
        <p>
          Urdimbre se reserva el derecho de modificar estos términos. En caso de cambios importantes, se notificará debidamente a les usuaries registrades.
        </p>

        <h2>5. Contacto</h2>
        <p>
          Para cualquier consulta relacionada con estos términos, puedes escribirnos a contacto@urdimbre.org.
        </p>
      </section>
    </MainLayout>
  );
};

export default Terms;
