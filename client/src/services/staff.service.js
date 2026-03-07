import api from "./api";

// GET all staff
export const getStaffApi = () => api.get("/staff");

// POST new staff
export const createStaffApi = (data) => api.post("/staff", data);

// PUT update staff
export const updateStaffApi = (id, data) => api.put(`/staff/${id}`, data);

// DELETE staff
export const deleteStaffApi = (id) => api.delete(`/staff/${id}`);

export const ToggleStaff = (id) => api.patch(`/staff/${id}`);