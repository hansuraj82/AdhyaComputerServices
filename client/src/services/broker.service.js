import api from "./api";

export const addBroker = (data) =>
  api.post("/broker", data);

export const updateBroker = (id, data) =>
  api.put(`/broker/${id}`, data);

export const enableBroker = (id) =>
  api.patch(`/broker/${id}/enable`);

export const disableBroker = (id) =>
  api.patch(`/broker/${id}/disable`);

export const getBrokers = () =>
  api.get("/broker");

export const getActiveBrokers = () =>
  api.get("/broker/active");

export const getBrokerSummary = () =>
  api.get("/broker/summary");

export const getBrokerWork = (brokerId, params) =>
  api.get(`/broker/${brokerId}/work`, { params });