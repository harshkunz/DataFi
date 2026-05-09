import "./types/express";

import express from "express";
import cors from "cors";
import ENV  from './config/env';

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

import { globalLimiter } from "./middlewares/rateLimiter";
import { db } from "./config/db";

import adminUsersRoutes from "./routes/admin.users.routes";
import adminTransactionsRoutes from "./routes/admin.transactions.routes";
import adminBillsRoutes from "./routes/admin.bills.routes";
import adminGoalsRoutes from "./routes/admin.goals.routes";
import adminRecurringRoutes from "./routes/admin.recurring.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(globalLimiter);


app.use(
    "/api-docs", 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, { explorer: true })
);


app.use("/api/admin", adminUsersRoutes);
app.use("/api/admin/transactions", adminTransactionsRoutes);
app.use("/api/admin/bills", adminBillsRoutes);
app.use("/api/admin/goals", adminGoalsRoutes);
app.use("/api/admin/recurring", adminRecurringRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.json({ status: "ok" })
})


const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
    console.log(`check http://localhost:${PORT}`);
})

const shutdown = async () => {
    console.log("Shutting down...");

    try {
        await db.$disconnect();
        server.close(() => {
            console.log("server closed!");
            process.exit(0);
        });

    } catch (error) {
        console.error("Shutdown error:", error)
        process.exit(1);
    }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);