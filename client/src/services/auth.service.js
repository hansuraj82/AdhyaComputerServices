import api from "./api";
export const getOwnerEmailApi = () => api.get("/auth/getOwner");
export const loginApi = (data) => api.post("/auth/login", data);
export const forgotPasswordApi = (data) => {return api.post("/auth/forgot-password", data);}
export const resetPasswordApi = (data) => api.post("/auth/reset-password", data);
export const changePasswordApi = (data) => api.post("/auth/change-password", data);
export const requestEmailChangeApi = (data) => api.post("/auth/change-email/request",data);
export const resendEmailChangeOTPApi = () => api.post("/auth/change-email/resend");
export const verifyEmailChangeApi = (otp) => api.post("/auth/change-email/verify",otp);
