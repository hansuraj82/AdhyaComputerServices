import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import policyRoutes from './routes/policy.routes.js';
import gstRoutes from './routes/gst.routes.js';
import itrRoutes from './routes/itr.routes.js';
import brokerRoutes from './routes/broker.routes.js'
import notificationRoutes from './routes/notification.routes.js';
import errorHandler from "./middleware/error.middleware.js";

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/gst", gstRoutes);
app.use("/api/itr", itrRoutes);
app.use("/api/broker", brokerRoutes);
app.use("/api/notification", notificationRoutes);

app.use(errorHandler);

export default app;
