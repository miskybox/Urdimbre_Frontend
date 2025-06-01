import React, { useState } from "react";
import MainLayout from "../mainLayout/MainLayout";
import "./Home.css";
import logo from "/assets/logo-urdimbre-final.png";

const images = [
  "/assets/img1.png",
  "/assets/img2.png",
  "/assets/img3.png",
  "/assets/logo-urdimbre-final.png",
]; //yo no teng las imagenes

const Home = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  return (
    <MainLayout>
      <section className="carousel">
        <button className="nav left" onClick={prevSlide}>
          ←
        </button>
        <img
          src={images[current]}
          alt="Carusel Urdimbre"
          className="carousel-img"
        />
        <button className="nav rigth" onClick={nextSlide}>
          →
        </button>
      </section>

      <section className="about-us">
        <h2>¿Qué es Urdimbre?</h2>
        <p>
          Urdimbre es una asociación creada por y para personas trans, no
          binarias e intersex. Promueve una red de actividades de ocio, cultura,
          deporte y tiempo libre desde una perspectiva comunitaria, inclusiva y
          segura.
        </p>
        <p>
          {" "}
          Nacida de iniciativas como <strong>Boxeo Trans</strong> y otros
          proyectos impulsados por
          <strong> Biceps & Drama</strong>, Urdimbre da continuidad a estas
          propuestas y crea nuevas oportunidades para nuestras comunidades.
        </p>
        <p>
          {" "}
          Además de ofrecer espacios de encuentro, Urdimbre impulsa la creación
          de empleo digno y accesible para personas trans, no binarias e
          intersex.
        </p>
        <div className="about-list">
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
