import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import teamRoutes from "./routes/teamRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";
import { initBackupScheduler } from "./utils/backupScheduler.js";

import { notFound, errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// ─── Performance: GZIP Response Compression ───
app.use(compression());

// ─── Security: CORS Configuration ───
const allowedOrigins = [
  "https://ams-hackathon.site",
  "https://www.ams-hackathon.site",
  "https://ams-hackathon-2026.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".ams-hackathon.site")
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Security: HTTP Headers ───
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.removeHeader("X-Powered-By");
  next();
});

// ─── Body Parsers with Size Limits ───
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Root & Health Check Route
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Connecting/Disconnected";
  res.status(200).json({
    success: true,
    message: "AMS HACKATHON 2026 API Server is running.",
    database: dbStatus,
    timestamp: new Date(),
  });
});

app.get("/api/health", (req, res) => {
  const isHealthy = mongoose.connection.readyState === 1;
  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "UP" : "DOWN",
    database: isHealthy ? "CONNECTED" : "DISCONNECTED",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/teams", teamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/backups", backupRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/contact", contactRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  await connectDB();
  initBackupScheduler();
  console.log(`AMS HACKATHON 2026 Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default app;
