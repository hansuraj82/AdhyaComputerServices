import express from "express";
import { changePassword, forgotPassword, loginOwner, resetPassword } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import { forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.post("/login", loginOwner);
router.post("/change-password",protect,changePassword);
router.post("/forgot-password",forgotPasswordLimiter,forgotPassword);
router.post("/reset-password",resetPassword)

export default router;
