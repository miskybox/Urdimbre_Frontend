import React, { useState } from "react";
import styles from "./Header.module.css";
import { FaBars } from "react-icons/fa";
import Sidebar from "../sideBar/SideBar";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className={styles.logoContainer}>
          <img
            src="/logo/urdimbreLogo.png"
            alt="Logo Urdimbre"
            className={styles.logo}
            onClick={() => window.location.reload()}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
