import express from "express";
import {
  addBroker,
  updateBroker,
  disableBroker,
  enableBroker,
  getBrokers,
  getActiveBrokers,
  getBrokerSummary,
  getBrokerWork
} from "../controllers/broker.controller.js";
import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("owner"), addBroker);
router.get("/", protect, authorize("owner"), getBrokers);
router.get("/summary", protect, authorize("owner"), getBrokerSummary);
router.get("/:brokerId/work", protect, authorize("owner"), getBrokerWork);
router.get("/active", protect, getActiveBrokers);
router.put("/:id", protect, authorize("owner"), updateBroker);
router.patch("/:id/disable", protect, authorize("owner"), disableBroker);
router.patch("/:id/enable", protect, authorize("owner"), enableBroker);

export default router;
