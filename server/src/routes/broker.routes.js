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

const router = express.Router();

router.post("/", protect, addBroker);
router.get("/", protect, getBrokers);
router.get("/summary", protect, getBrokerSummary);
router.get("/:brokerId/work", protect, getBrokerWork);
router.get("/active", protect, getActiveBrokers);
router.put("/:id", protect, updateBroker);
router.patch("/:id/disable", protect, disableBroker);
router.patch("/:id/enable", protect, enableBroker);

export default router;
