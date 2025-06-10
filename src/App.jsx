import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import ClassDetailPage from "./pages/classDetail/ClassDetailPage";
import UserManagementPage from "./pages/usermanagementpage/UserManagementPage";
import Privacy from "./pages/privacy/Privacy";
import Terms from "./pages/terms/Terms";
import ProfilePage from "./pages/profile/ProfilePage";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Página de inicio: Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/class/:classId" element={<ClassDetailPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
