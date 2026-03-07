import express from "express";
import {
  createStaff,
  getStaff,
  deleteStaff,
  loginStaff,
  toggleStaff
} from "../controllers/staff.controller.js";
import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";



const router = express.Router();

router.post("/login",loginStaff);

router.post("/", protect, authorize("owner"), createStaff);

router.get("/", protect, authorize("owner"), getStaff);

router.delete("/:id", protect, authorize("owner"), deleteStaff);

router.patch("/:id", protect, authorize("owner"), toggleStaff);

export default router;