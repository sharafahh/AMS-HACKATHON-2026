import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../server/config/db.js";

import teamRoutes from "../server/routes/teamRoutes.js";
import paymentRoutes from "../server/routes/paymentRoutes.js";
import adminRoutes from "../server/routes/adminRoutes.js";
import certificateRoutes from "../server/routes/certificateRoutes.js";
import announcementRoutes from "../server/routes/announcementRoutes.js";
import contactRoutes from "../server/routes/contactRoutes.js";
import backupRoutes from "../server/routes/backupRoutes.js";

import { notFound, errorHandler } from "../server/middlewares/errorHandler.js";

dotenv.config();

const app = express();

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

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMS HACKATHON 2026 API Server is running on Vercel.",
    timestamp: new Date(),
  });
});

app.use("/api/teams", teamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/backups", backupRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default async function handler(req, res) {
  try {
    try {
      await connectDB();
    } catch (dbErr) {
      console.warn("MongoDB connection warning in Vercel function:", dbErr.message);
    }
    return app(req, res);
  } catch (err) {
    console.error("Vercel Serverless Function Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
