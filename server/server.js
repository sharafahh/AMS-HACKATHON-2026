import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import teamRoutes from "./routes/teamRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

// Initialize MongoDB Connection
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMS HACKATHON 2026 API Server is running smoothly!",
    organizer: "Aalim Muhammed Salegh College of Engineering",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/teams", teamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/announcements", announcementRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AMS HACKATHON 2026 Server running on http://localhost:${PORT}`);
});
