import api from "./api";
export const getITRsByCustomer = (customerId) => api.get(`/itr/customer/${customerId}`);
export const getAllITR = (filters) => api.get("/itr/allITR", { params: filters });
export const addITR = (data) => api.post('/itr', data);
export const updateITR = (id, data) => api.put(`/itr/${id}`, data);
export const deleteITR = (id) => api.delete(`/itr/${id}`);
export const addDocument = (id, data) => api.post(`/itr/${id}/documents`, data);
export const deleteDocument = (itrId, docId) => api.delete(`/itr/${itrId}/documents/${docId}`);