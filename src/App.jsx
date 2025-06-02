// src/App.jsx (Sin Router - se configura en main.jsx)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import CalendarPage from './pages/calendar/CalendarPage';
import ClassDetailPage from './pages/classDetail/ClassDetailPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rutas públicas - sin protección */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/class/:classId" element={<ClassDetailPage />} />
        
        {/* Ruta por defecto - redirige al calendario */}
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        
        {/* Catch all - redirige al calendario */}
        <Route path="*" element={<Navigate to="/calendar" replace />} />
      </Routes>
    </div>
  );
}

export default App;


