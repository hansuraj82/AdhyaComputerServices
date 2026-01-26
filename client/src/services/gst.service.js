import api from "./api"; // Your configured axios instance

// POST /api/gst
export const addGST = async (gstData) => {
  return await api.post("/gst", gstData);
};

// GET /api/gst/customer/:customerId
export const getGSTByCustomer = async (customerId) => {
  return await api.get(`/gst/customer/${customerId}`);
};

// GET /api/gst/:id
export const getSingleGST = async (id) => {
  return await api.get(`/gst/${id}`);
};

export const getAllGST = async (filters) => api.get("/gst/allGST", { params: filters });

// DELETE /api/gst/:id
export const deleteGST = async (id) => {
  return await api.delete(`/gst/${id}`);
};

// PUT /api/gst/:id
export const updateGST = async (id, updateData) => {
  return await api.put(`/gst/${id}`, updateData);
};

/* ---------- DOCUMENT ACTIONS ---------- */

// POST /api/gst/:id/documents
export const addDocument = async (id, docData) => {
  // docData: { label, url, publicId, resourceType }
  return await api.post(`/gst/${id}/documents`, docData);
};

// DELETE /api/gst/:gstId/documents/:documentId
export const deleteDocument = async (gstId, documentId) => {
  return await api.delete(`/gst/${gstId}/documents/${documentId}`);
};