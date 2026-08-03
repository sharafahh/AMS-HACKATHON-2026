import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../server/config/db.js";

import teamRoutes from "../server/routes/teamRoutes.js";
import paymentRoutes from "../server/routes/paymentRoutes.js";
import adminRoutes from "../server/routes/adminRoutes.js";
import certificateRoutes from "../server/routes/certificateRoutes.js";
import announcementRoutes from "../server/routes/announcementRoutes.js";

import { notFound, errorHandler } from "../server/middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMS HACKATHON 2026 API Server is running smoothly on Vercel!",
    timestamp: new Date(),
  });
});

app.use("/api/teams", teamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/announcements", announcementRoutes);

app.use(notFound);
app.use(errorHandler);

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.warn("MongoDB connection warning in Vercel function:", error.message);
  }
  return app(req, res);
}
