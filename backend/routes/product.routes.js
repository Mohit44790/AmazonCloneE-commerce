import express from "express";

import {
  optionalAuth,
  protect,
  restrictTo,
  restrictToSeller,
} from "../middlewares/errorHandler.js";

import {
  upload,
} from "../config/cloudinary.js";

import {
  approveProduct,
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getProductStats,
  getProduct,
  searchSuggestions,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// =============================================
// MULTER FIELDS
// =============================================

const uploadFields = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);

// =============================================
// PUBLIC ROUTES
// =============================================

router.get(
  "/",
  optionalAuth,
  getAllProducts
);

router.get(
  "/search/suggestions",
  searchSuggestions
);

// =============================================
// SELLER ROUTES
// =============================================

router.get(
  "/my-products",
  protect,
  restrictTo(
    "seller",
    "admin",
    "superadmin"
  ),
  getMyProducts
);

router.get(
  "/stats",
  protect,
  restrictTo(
    "seller",
    "admin",
    "superadmin"
  ),
  getProductStats
);

// =============================================
// SINGLE PRODUCT
// =============================================

router.get(
  "/:id",
  optionalAuth,
  getProduct
);

// =============================================
// CREATE PRODUCT
// =============================================

router.post(
  "/",
  protect,
  restrictTo(
    "seller",
    "admin",
    "superadmin"
  ),
  restrictToSeller,
  uploadFields,
  createProduct
);

// =============================================
// UPDATE PRODUCT
// =============================================

router.put(
  "/:id",
  protect,
  restrictTo(
    "seller",
    "admin",
    "superadmin"
  ),
  uploadFields,
  updateProduct
);

// =============================================
// DELETE PRODUCT
// =============================================

router.delete(
  "/:id",
  protect,
  restrictTo(
    "seller",
    "admin",
    "superadmin"
  ),
  deleteProduct
);

// =============================================
// APPROVE PRODUCT
// =============================================

router.patch(
  "/:id/approve",
  protect,
  restrictTo(
    "admin",
    "superadmin"
  ),
  approveProduct
);

export default router;