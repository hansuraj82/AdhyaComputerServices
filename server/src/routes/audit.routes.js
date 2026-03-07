import express from "express";
import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { getAuditLogs } from "../controllers/audit.controller.js";

const router = express.Router();

router.get("/", protect, authorize("owner"), getAuditLogs);

export default router;