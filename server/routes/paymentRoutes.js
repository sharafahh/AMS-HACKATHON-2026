import express from "express";
import {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  handlePaymentCancel,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post("/failure", handlePaymentFailure);
router.post("/cancel", handlePaymentCancel);

export default router;
