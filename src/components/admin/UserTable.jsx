import { useEffect, useState } from 'react';
import styles from './UserTable.module.css';
import api from '../../config/api';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users'); // ✅ tu backend responde en /api/users y ya está configurado el baseURL
        setUsers(response.data); // ✅ se espera un array de objetos tipo UserResponseDTO
      } catch (err) {
        console.error('❌ Error cargando usuaries:', err?.response?.data || err.message);
        setError(true);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, roles: [newRole] } : u
      )
    );
  };

  if (error) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Gestión de usuaries</h2>
        <p className={styles.error}>No se pudieron cargar les usuaries.</p>
      </div>
    );
  }

  if (!users.length) {
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.label}>Nombre</th>
            <th className={styles.label}>Email</th>
            <th className={styles.label}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className={styles.hint}>{u.fullName || u.username}</td>
              <td className={styles.hint}>{u.email}</td>
              <td>
                <select
                  value={u.roles[0]}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className={styles.input}
                >
                  <option value="user">User</option>
                  <option value="organizador">Organizadore</option>
                  <option value="admin">Admin</option>
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
