import express from "express";
import { acknowledgePolicyNotification, getNotifications, getNotificationsWithOutSnoozed } from "../controllers/notification.controller.js";
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/notifications-with-snoozed", protect, getNotifications);
router.get("/notification-without-snoozed", protect, getNotificationsWithOutSnoozed);
router.patch("/:id/acknowledge", protect, acknowledgePolicyNotification);

export default router;
