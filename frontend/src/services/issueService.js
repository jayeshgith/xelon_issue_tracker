import api from './api.js';

export const getIssues = async (params = {}) => {
  const { data } = await api.get('/issues', { params });
  return {
    issues: data.data.issues,
    pagination: data.meta
  };
};

export const getIssue = async (id) => {
  const { data } = await api.get(`/issues/${id}`);
  return data.data.issue;
};

export const createIssue = async (payload) => {
  const { data } = await api.post('/issues', payload);
  return data.data.issue;
};

export const updateIssue = async (id, payload) => {
  const { data } = await api.put(`/issues/${id}`, payload);
  return data.data.issue;
};

export const assignIssue = async (id, assignedTo) => {
  const { data } = await api.put(`/issues/${id}/assign`, { assignedTo });
  return data.data.issue;
};

export const deleteIssue = async (id) => {
  const { data } = await api.delete(`/issues/${id}`);
  return data;
};
