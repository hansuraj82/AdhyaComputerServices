import api from "./api"; // Your configured axios instance


export const addNote = async (noteData) => {
  return await api.post("/notes/add", noteData);
};

export const getNotesByCustomer = async (customerId) => {
  return await api.get(`/notes/customer/${customerId}`);
};

export const updateNote = async (noteId, noteData) => {
  return await api.put(`/notes/edit/${noteId}`, noteData);
};

export const deleteNote = async (noteId) => {
  return await api.delete(`/notes/${noteId}`);
};