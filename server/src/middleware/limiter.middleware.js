import rateLimit from "express-rate-limit";

/**
 * Common configuration to keep response 
 * formats consistent with your errorHandler.
 */
const commonOptions = (message, maxRequests, minutes) => ({
  windowMs: minutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: message || options.message.message,
    });
  },
});

// 🟢 INTERNAL API LIMITER: For general browsing (Customers, Policies, etc.)
// Allows 200 requests every 15 minutes.
export const apiLimiter = rateLimit(
  commonOptions("Too many requests. Please Try after 15 minutes.", 200, 15)
);

// 🔴 AUTH SHIELD: For Login, Register, and Password Reset.
// Strict: Allows only 10 attempts per hour to prevent Brute Force.
export const authLimiter = rateLimit(
  commonOptions("Security alert: Too many login attempts. Try again in an hour.", 15, 60)
);

// 🟡 SENSITIVE ACTIONS: For things like deleting staff or changing emails.
// Allows 20 requests every 30 minutes.
export const sensitiveLimiter = rateLimit(
  commonOptions("Action limit reached. Please wait before trying again.", 20, 30)
);