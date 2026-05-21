import express from "express";
import { optionalAuth, protect, restrictTo, restrictToSeller } from "../middlewares/errorHandler.js";
import { upload } from "../config/cloudinary.js";
import {
  createProduct, deleteProduct, getAllProducts,
  getMyProducts, getProductStats, getProduct,
  searchSuggestions, updateProduct, approveProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);

// ── public ──────────────────────────────────
router.get("/", optionalAuth, getAllProducts);
router.get("/search/suggestions", searchSuggestions);

// ── these MUST be before /:id ────────────────
router.get("/my-products", protect, restrictTo("seller", "admin", "superadmin"), getMyProducts);
router.get("/stats", protect, restrictTo("seller", "admin", "superadmin"), getProductStats);

// ── /:id routes last ─────────────────────────
router.get("/:id", optionalAuth, getProduct);
router.post("/", protect, restrictTo("seller", "admin", "superadmin"), restrictToSeller, uploadFields, createProduct);
router.put("/:id", protect, restrictTo("seller", "admin", "superadmin"), uploadFields, updateProduct);
router.delete("/:id", protect, restrictTo("seller", "admin", "superadmin"), deleteProduct);
router.patch("/:id/approve", protect, restrictTo("admin", "superadmin"), approveProduct);

export default router;