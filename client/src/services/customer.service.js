import api from "./api";

export const createCustomer = async (data) => {
    return await api.post(`/customers`, data);
}

export const getCustomerById = (id) => {
    return api.get(`/customers/customer/${id}`);
}

export const updateCustomer = (id, data) => {
    return api.patch(`/customers/customer/${id}`, data);
}

export const uploadDocument = (id, doc) => {
    return api.post(`/customers/${id}/documents`, doc);
}

export const getCustomersApi = ({ page, limit }) => {
    return api.get(`/customers?page=${page}&limit=${limit}`);
}
export const searchCustomersApi = ({ type, q, page, limit,isDeleted }) => {
    return api.get(`/customers/search?type=${type}&q=${q}&page=${page}&limit=${limit}&isDeleted=${isDeleted}`
    );
}

export const softDeleteCustomer = (id) => {
    return api.put(`/customers/${id}/trash`);
}

export const bulkSoftDeleteCustomers = (ids) => {
    return api.put(`/customers/bulk-trash`, { ids });
}

export const getTrashCustomers = (page, limit) => {
    return api.get(`/customers/trash?page=${page}&limit=${limit}`);
}
export const restoreCustomer = (id) => {
    return api.put(`/customers/${id}/restore`);
    }

export const permanentDeleteCustomer = (id) => {
    return api.delete(`/customers/${id}/permanent`);
}
    

export const bulkRestoreCustomers = (ids) =>
    api.put("/customers/bulk-restore", { ids });

export const bulkPermanentDeleteCustomers = (ids) => {
    return api.post("/customers/bulk-permanent", { ids });
}

export const deleteDocument = (id, deleteDocId) => {
    return api.delete(`/customers/${id}/documents/${deleteDocId}`);
}

