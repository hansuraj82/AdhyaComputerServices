import api from "./api";

export const addPolicy = (data) =>
  api.post("/policy", data);

export const updatePolicy = (id, data) =>
  api.put(`/policy/${id}`, data);

export const deletePolicy = (id) =>
  api.delete(`/policy/${id}`);

export const getPoliciesByCustomer = (customerId) =>
  api.get(`/policy/customer/${customerId}`);

export const getSinglePolicy = (id) =>
  api.get(`/policy/${id}`);

export const getAllPolicies = (params) => api.get("/policy/allPolicy", { params });

export const addPolicyDocument = (policyId, doc) =>
  api.post(`/policy/${policyId}/documents`, doc);

export const deletePolicyDocument = (policyId, docId) =>
  api.delete(`/policy/${policyId}/documents/${docId}`);

export const archivePolicy = (customerId) => api.put(`/policy/${customerId}/archive`)
