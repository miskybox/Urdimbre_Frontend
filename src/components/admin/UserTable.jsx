import { useEffect, useState } from 'react';
import styles from './UserTable.module.css';
import api from '../../config/api';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  // 🔁 Obtener usuaries al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response);
      } catch {
        setError(true);
      }
    };

    fetchUsers();
  }, []);

  // 🔄 Manejar cambio de rol
  const handleRoleChange = async (userId, newRole) => {
    const newRoles = [newRole];
    try {
      await api.updateUserRoles(userId, newRoles);
      setUsers(prev => 
        prev.map(u => (u.id === userId ? { ...u, roles: newRoles } : u))
      );
      setMessage('✅ Cambio de rol realizado con éxito');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Error al actualizar el rol');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (error) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Gestión de usuaries</h2>
        <p className={styles.error}>No se pudieron cargar les usuaries.</p>
      </div>
    );
  }

  if (!Array.isArray(users) || !users.length) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Gestión de usuaries</h2>
        <p className={styles.loading}>Cargando usuaries...</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Gestión de usuaries</h2>
      {message && <p className={message.startsWith('✅') ? styles.success : styles.error}>{message}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.label}>Nombre</th>
            <th className={styles.label}>Email</th>
            <th className={styles.label}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className={styles.hint}>
                {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username}
              </td>
              <td className={styles.hint}>{u.email}</td>
              <td>
                <select
                  value={u.roles[0]}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                  className={styles.input}
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ORGANIZER">Organizadore</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
