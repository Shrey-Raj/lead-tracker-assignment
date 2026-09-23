import express from "express";
import cors from "cors";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import healthCheckRouter from "./src/routes/healthcheck.route.js";
import leadsRouter from "./src/routes/leads.route.js";

const app = express();
app.use(cors("*"));
app.use(express.json());

app.use("/api/v1", healthCheckRouter);
app.use("/api/v1/leads", leadsRouter);

app.use(errorHandler);

export default app;