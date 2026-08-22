import api from './api.js';

export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data.data.users;
};

export const getDevelopers = async () => {
  const { data } = await api.get('/users/developers');
  return data.data.developers;
};
