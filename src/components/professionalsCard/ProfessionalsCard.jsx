import React from "react";
import styles from "./ProfessionalsCard.module.css";

const ProfessionalsCard = ({
  image,
  nProfesional,
  description,
  location,
  price,
}) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={nProfesional} className={styles.image} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.name}>{nProfesional}</h2>
          <div className={styles.price}>
            <span>{price}€</span>
            <small>/h</small>
          </div>
        </div>

        <div className={styles.subinfo}>
          <span className={styles.location}>📍 {location}</span>
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default ProfessionalsCard;
