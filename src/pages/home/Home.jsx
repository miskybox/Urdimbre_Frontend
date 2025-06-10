import React from "react";
import MainLayout from "../../components/mainLayout/MainLayout";
import Carousel from "../../components/carousel/Carousel";
import styles from "./Home.module.css";

const images = [
  "/image/image1.png",
  "/image/image2.png",
  "/image/image3.png",
];

const Home = () => {
  return (
    <MainLayout>
      <section className={styles.carouselContainer}>
        <Carousel images={images} />
      </section>

      <section className={styles.aboutUs}>
        <h2>¿Qué es Urdimbre?</h2>
        <p>
          Urdimbre es una asociación creada por y para personas trans, no
          binarias e intersex. Promueve una red de actividades de ocio, cultura,
          deporte y tiempo libre desde una perspectiva comunitaria, inclusiva y
          segura.
        </p>
        <p>
          Nacida de iniciativas como <strong>Boxeo Trans</strong> y otros
          proyectos impulsados por <strong>Biceps & Drama</strong>, Urdimbre da
          continuidad a estas propuestas y crea nuevas oportunidades para nuestras
          comunidades.
        </p>
        <p>
          Además de ofrecer espacios de encuentro, Urdimbre impulsa la creación
          de empleo digno y accesible para personas trans, no binarias e intersex.
        </p>
        <div className={styles.aboutList}>
          <strong>Nuestros ejes de acción:</strong>
          <ul>
            <li>Crear nuevos proyectos comunitarios</li>
            <li>Sostener las iniciativas ya existentes</li>
            <li>Tejer redes entre colectivos, actividades y personas</li>
          </ul>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
