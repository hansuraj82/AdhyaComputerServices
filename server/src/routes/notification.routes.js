import express from "express";
import { acknowledgePolicyNotification, getNotifications, getNotificationsWithOutSnoozed } from "../controllers/notification.controller.js";
import protect from "../middleware/auth.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get("/notifications-with-snoozed", protect, authorize("owner"), getNotifications);
router.get("/notification-without-snoozed", protect, authorize("owner"), getNotificationsWithOutSnoozed);
router.patch("/:id/acknowledge", protect, authorize("owner"), acknowledgePolicyNotification);

export default router;
