import React from "react";
import styles from "./SideBar.module.css";
import { Link, useNavigate } from "react-router-dom";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toggleSidebar();
  };

  if (!isOpen) return null;

  return (
    <>
    
      <button className={styles.closeButton} onClick={toggleSidebar} aria-label="Cerrar menú lateral">
        ✕
      </button>

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Menú lateral de navegación"
        role="navigation"
      >
        <nav className={styles.nav}>
          <Link to="/profile" onClick={toggleSidebar}>Perfil</Link>
          <Link to="/home" onClick={toggleSidebar}>Inicio</Link>
          <span onClick={toggleSidebar}>Eventos culturales</span>
          <Link to="/calendar" onClick={toggleSidebar}>Actividades Urdimbre</Link>
          <Link to="/admin/users" onClick={toggleSidebar}>Gestión de usuarios</Link>
          <span onClick={handleLogout}>Cerrar sesión</span>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
