import express from "express";
import { getMyPayments, getPaymentStats } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getMyPayments);
router.get("/stats", protect, getPaymentStats);

export default router;
