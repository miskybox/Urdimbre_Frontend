
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return res.data;
};

export const updateUserRole = async (userId, newRole) => {
  const res = await axios.put(
    `${API_URL}/users/${userId}/role`,
    { role: newRole },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return res.data;
};
