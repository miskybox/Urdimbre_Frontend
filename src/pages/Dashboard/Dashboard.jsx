import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import dashboardService from '../../services/dashboardService'; // ✅ uso correcto
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.hasRole('ADMIN');
  const isOrganizer = authService.hasRole('ORGANIZER');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboard();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error cargando el dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRefresh}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {currentUser.username}</p>

      {dashboardData?.stats && (
        <ul>
          <li>Total Usuarios: {dashboardData.stats.totalUsers}</li>
          <li>Total Actividades: {dashboardData.stats.totalActivities}</li>
          <li>Invitaciones Activas: {dashboardData.stats.activeInvites}</li>
        </ul>
      )}

      <RecentActivitiesWidget />
    </div>
  );
};

// Actividades recientes
const RecentActivitiesWidget = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    const result = await dashboardService.getRecentActivities();
    if (result.success) {
      setActivities(result.data || []);
    }
    setLoading(false);
  };

  if (loading) return <p>Cargando actividades recientes...</p>;

  return (
    <div>
      <h2>Actividades Recientes</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((a, i) => (
            <li key={i}>{a.title} - {a.date}</li>
          ))}
        </ul>
      ) : (
        <p>No hay actividades recientes.</p>
      )}
    </div>
  );
};

export default Dashboard;
