import api from "./api";

export const loginApi = (data) => api.post("/auth/login", data);
export const forgotPasswordApi = (data) => {return api.post("/auth/forgot-password", data);}
export const resetPasswordApi = (data) => api.post("/auth/reset-password", data);
export const changePasswordApi = (data) => api.post("/auth/change-password", data);
