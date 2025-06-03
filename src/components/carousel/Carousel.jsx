import React, { useState } from "react";
import styles from "./Carousel.module.css";

const Carousel = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.carousel} role="region" aria-label="Carrusel de imágenes">
      <button
        className={`${styles.nav} ${styles.left}`}
        onClick={prevSlide}
        aria-label="Anterior"
      >
        ←
      </button>

      <img
        src={images[current]}
        alt={`Imagen ${current + 1}`}
        className={styles.carouselImg}
      />

      <button
        className={`${styles.nav} ${styles.right}`}
        onClick={nextSlide}
        aria-label="Siguiente"
      >
        →
      </button>
    </div>
  );
};

export default Carousel;
