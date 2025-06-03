import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerIcons}>
          <FaFacebookF className={styles.icon} aria-label="Facebook" />
          <FaInstagram className={styles.icon} aria-label="Instagram" />
          <FaXTwitter className={styles.icon} aria-label="Twitter" />
        </div>

        <div className={styles.footerText}>
          <p>© 2025 <strong>Urdimbre™</strong>. Todos los derechos reservados.</p>
          <p>
            <Link to="/privacy" className={styles.footerLink}>
              Política de privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
