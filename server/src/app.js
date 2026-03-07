import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import policyRoutes from './routes/policy.routes.js';
import gstRoutes from './routes/gst.routes.js';
import itrRoutes from './routes/itr.routes.js';
import brokerRoutes from './routes/broker.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import noteRoutes from './routes/note.routes.js';
import StaffRoutes from "./routes/staff.routes.js"
import auditRoutes from "./routes/audit.routes.js"
import errorHandler from "./middleware/error.middleware.js";
import { apiLimiter, authLimiter } from "./middleware/limiter.middleware.js";


const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/customers", apiLimiter, customerRoutes);
app.use("/api/policy", apiLimiter, policyRoutes);
app.use("/api/gst", apiLimiter, gstRoutes);
app.use("/api/itr", apiLimiter, itrRoutes);
app.use("/api/broker", apiLimiter, brokerRoutes);
app.use("/api/notification", apiLimiter, notificationRoutes);
app.use("/api/notes", apiLimiter, noteRoutes);
app.use("/api/staff", apiLimiter, StaffRoutes);
app.use("/api/audit", apiLimiter, auditRoutes)


app.use(errorHandler);

export default app;
