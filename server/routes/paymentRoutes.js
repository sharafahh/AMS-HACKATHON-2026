import express from "express";
import {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  handlePaymentCancel,
} from "../controllers/paymentController.js";

const router = express.Router();

// Primary POST payment endpoints
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post("/failure", handlePaymentFailure);
router.post("/cancel", handlePaymentCancel);

// GET Method handling for clear API documentation & status inspection
router.get("/create-order", (req, res) => {
  res.status(405).json({
    success: false,
    message: "HTTP GET is not supported on /api/payments/create-order. Please use HTTP POST with JSON payload { teamSize: number }.",
    endpoint: "/api/payments/create-order",
    allowedMethod: "POST",
  });
});

router.get("/verify", (req, res) => {
  res.status(405).json({
    success: false,
    message: "HTTP GET is not supported on /api/payments/verify. Please use HTTP POST with JSON verification payload.",
    endpoint: "/api/payments/verify",
    allowedMethod: "POST",
  });
});

export default router;
