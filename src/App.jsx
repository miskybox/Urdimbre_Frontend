import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import CalendarPage from './pages/calendar/CalendarPage';
import ClassDetailPage from './pages/classDetail/ClassDetailPage';
import UserManagementPage from './pages/usermanagementpage/UserManagementPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirección de / a /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Rutas públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/class/:classId" element={<ClassDetailPage />} />

        {/* Ruta para admins */}
        <Route path="/admin/users" element={<UserManagementPage />} />
      </Routes>
    </div>
  );
}

export default App;
