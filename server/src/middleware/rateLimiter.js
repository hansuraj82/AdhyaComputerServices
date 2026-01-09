import rateLimit from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                  // max 5 requests
  message: {
    message:
      "Too many password reset attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});
