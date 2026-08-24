import api from './api';

export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (title, content) => {
  const response = await api.post('/notes', { title, content });
  return response.data;
};

export const updateNote = async (id, title, content) => {
  const response = await api.put(`/notes/${id}`, { title, content });
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const togglePin = async (id) => {
  const response = await api.patch(`/notes/${id}/pin`);
  return response.data;
};

export const getTrash = async () => {
  const response = await api.get('/notes/trash');
  return response.data;
};

export const restoreNote = async (id) => {
  const response = await api.patch(`/notes/${id}/restore`);
  return response.data;
};

export const permanentlyDeleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}/permanent`);
  return response.data;
};