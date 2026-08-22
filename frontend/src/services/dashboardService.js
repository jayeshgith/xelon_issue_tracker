import api from './api.js';

export const getDashboard = async (role) => {
  const endpoint = role === 'admin' ? '/dashboard/admin' : role === 'developer' ? '/dashboard/developer' : '/dashboard/user';
  const { data } = await api.get(endpoint);
  return data.data;
};
