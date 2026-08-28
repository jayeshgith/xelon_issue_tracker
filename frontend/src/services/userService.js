import api from './api.js';

export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data.data.users;
};

export const getDevelopers = async () => {
  const { data } = await api.get('/users/developers');
  return data.data.developers;
};

export const createDeveloper = async (payload) => {
  const { data } = await api.post('/users/developers', payload);
  return data.data.developer;
};

export const updateDeveloper = async (id, payload) => {
  const { data } = await api.put(`/users/developers/${id}`, payload);
  return data.data.developer;
};

export const updateDeveloperStatus = async (id, isActive) => {
  const { data } = await api.patch(`/users/developers/${id}/status`, { isActive });
  return data.data.developer;
};

export const getDeveloperCredential = async (id) => {
  const { data } = await api.get(`/users/developers/${id}/credential`);
  return data.data;
};
