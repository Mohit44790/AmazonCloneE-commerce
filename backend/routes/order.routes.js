import express from "express";
import { protect, restrictTo } from "../middlewares/errorHandler.js";
import {
  createOrder,
  getMyOrders,
  getOrder,
  getOrderByNumber,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getSellerOrders,
  updateItemStatus,
  getOrderStats,
  verifyRazorpayPayment,
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(protect);

// ── Customer ──────────────────────────────────
router.post("/",                          createOrder);
router.get("/my-orders",                  getMyOrders);
router.get("/my-orders/:id",              getOrder);
router.get("/track/:orderNumber",         getOrderByNumber);
router.patch("/:id/cancel",               cancelOrder);
router.patch("/:id/return",               requestReturn);
router.post("/verify-payment/razorpay",   verifyRazorpayPayment);

// ── Seller ────────────────────────────────────
router.get("/seller/orders",              restrictTo("seller","admin","superadmin"), getSellerOrders);
router.patch("/:id/items/:itemId/status", restrictTo("seller","admin","superadmin"), updateItemStatus);

// ── Admin ─────────────────────────────────────
router.get("/stats",          restrictTo("seller","admin","superadmin"), getOrderStats);
router.get("/",               restrictTo("admin","superadmin"),          getAllOrders);
router.get("/:id",            restrictTo("admin","superadmin"),          getOrder);
router.patch("/:id/status",   restrictTo("admin","superadmin"),          updateOrderStatus);
router.patch("/:id/payment-status", restrictTo("admin","superadmin"),    updatePaymentStatus);

export default router;