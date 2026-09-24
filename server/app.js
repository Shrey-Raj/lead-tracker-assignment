import express from "express";
import cors from "cors";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import healthCheckRouter from "./src/routes/healthcheck.route.js";
import leadsRouter from "./src/routes/leads.route.js";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  .split(",")
  .map(origin => origin.trim());

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/v1", healthCheckRouter);
app.use("/api/v1/leads", leadsRouter);

app.use(errorHandler);

export default app;