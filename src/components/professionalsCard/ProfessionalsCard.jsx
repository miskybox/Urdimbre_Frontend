import React from "react";
import styles from "./ProfessionalsCard.module.css";

const ProfessionalsCard = ({
  nProfesional,
  description,
  location,
  actividades,
  price,
  telefono,
  email,
  web,
  redes,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.name}>{nProfesional}</h2>
          <div className={styles.price}>
            <span>{price}€</span>
            <small>/h</small>
          </div>
        </div>

        <div className={styles.subinfo}>
          {location && <span className={styles.location}>📍{location}</span>}
          {actividades && (
            <span className={styles.actividades}>🛠{actividades}</span>
          )}
          {telefono && <span className={styles.telefono}>📞 {telefono}</span>}
          {email && (
            <span className={styles.email}>
              📧 <a href={`mailto:${email}`}>{email}</a>
            </span>
          )}
          {web && (
            <span className={styles.web}>
              🌐{" "}
              <a href={web} target="_blank" rel="noreferrer">
                {web}
              </a>
            </span>
          )}
          {redes && (
            <span className={styles.redes}>
              🔗{" "}
              <a href={redes} target="_blank" rel="noreferrer">
                {redes}
              </a>
            </span>
          )}
        </div>

        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default ProfessionalsCard;
