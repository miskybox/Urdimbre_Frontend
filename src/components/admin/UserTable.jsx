import { useEffect, useState } from 'react';
import styles from './UserTable.module.css';
import useAuth from '../../hooks/useAuth';

const UserTable = () => {

  const user = { role: 'admin' };

  const [users, setUsers] = useState([]);

  useEffect(() => {
  

    const mockUsers = [
      { id: 1, firstName: "Alex", lastName: "Rivera", email: "alex@mail.com", role: "user" },
      { id: 2, firstName: "Sam", lastName: "López", email: "sam@mail.com", role: "organizador" },
      { id: 3, firstName: "Jess", lastName: "Martínez", email: "jess@mail.com", role: "admin" }
    ];

    setUsers(mockUsers);
  }, []);

  const handleRoleChange = (userId, newRole) => {
      setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

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
          {Array.isArray(users) && users.map((u) => (
            <tr key={u.id}>
              <td className={styles.hint}>{u.firstName} {u.lastName}</td>
              <td className={styles.hint}>{u.email}</td>
              <td>
                <select
                  value={u.role}
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
