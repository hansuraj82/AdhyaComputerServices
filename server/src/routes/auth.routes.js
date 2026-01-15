import express from "express";
import { changePassword, forgotPassword, getOwnerEmail, loginOwner, requestEmailChange, resendEmailChangeOTP, resetPassword, verifyEmailChangeOTP } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import { forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.post("/login", loginOwner);
router.get("/getOwner", protect, getOwnerEmail);
router.post("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-email/request", protect, requestEmailChange);
router.post("/change-email/verify", protect, verifyEmailChangeOTP);
router.post("/change-email/resend", protect, resendEmailChangeOTP);


export default router;
