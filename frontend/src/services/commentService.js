import api from './api.js';

export const getComments = async (issueId) => {
  const { data } = await api.get(`/issues/${issueId}/comments`);
  return data.data.comments;
};

export const createComment = async (issueId, text) => {
  const { data } = await api.post(`/issues/${issueId}/comments`, { text });
  return data.data.comment;
};

export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};
