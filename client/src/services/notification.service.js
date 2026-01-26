import api from "./api";

export const getNotificationsForBellApi = async () => await api.get("/notification/notification-without-snoozed");

export const getNotificationsApi = async () => await api.get("/notification/notifications-with-snoozed");

export const acknowledgeNotificationApi = async (id, days) => await api.patch(`/notification/${id}/acknowledge`, { days });