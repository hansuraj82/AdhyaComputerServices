import api from "./api";

export const getAuditLogsApi = (params) =>
  api.get("/audit", { params });