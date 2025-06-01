import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="menu-links">
        <span>Eventos</span>
        <span>Colectivos</span>
        <span>Foro</span>
        <span>Profesionales</span>
        <span>Sitios SEGUROS</span>
      </div>
      <div className="logo-container">
        <img
          src="./assets/logo-urdimbre-final.png"
          alt="Logo Urdimbre"
          className="Logo"
        />
      </div>
    </header>
  );
};

export default Header;
