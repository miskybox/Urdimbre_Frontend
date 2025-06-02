import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <FaFacebookF className="icon" />
        <FaInstagram className="icon" />
        <FaXTwitter className="icon" />
      </div>

      <div className="footer-text">
        <p>
          © 2025 Urdime™. Este sitio y su contenido están protegidos por
          derechos de autor.
        </p>
        <p>Todos los derechos reservados.</p>
        <p>Política de privacidad y tratamiento de datos personales.</p>
      </div>
    </footer>
  );
};

export default Footer;
