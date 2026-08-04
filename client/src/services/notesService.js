import api from './api';

export const getNotes = async () => {
  try {
    const response = await api.get('/notes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNoteById = async (id) => {
  try {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNote = async (title, content) => {
  try {
    const response = await api.post('/notes', { title, content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNote = async (id, title, content) => {
  try {
    const response = await api.put(`/notes/${id}`, { title, content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};