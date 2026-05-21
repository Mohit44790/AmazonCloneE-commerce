import express from "express";
import { protect, restrictTo } from "../middlewares/errorHandler.js";
import { uploadCategoryMiddleware } from "../config/cloudinary.js";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getFeaturedCategories,
  getCategoriesByType,
  getMenuCategories,
  getHomeCategories,
  seedCategories,
  updateProductCount,
  getCategoryBreadcrumb,
} from "../controllers/category.controller.js";

const router = express.Router();

// ── public routes ────────────────────────────
router.get("/",                getAllCategories);
router.get("/tree",            getCategoryTree);
router.get("/featured",        getFeaturedCategories);
router.get("/menu",            getMenuCategories);
router.get("/home",            getHomeCategories);
router.get("/type/:type",      getCategoriesByType);
router.get("/:slug/breadcrumb", getCategoryBreadcrumb);
router.get("/:slug",           getCategory);

// ── admin only ───────────────────────────────
router.post(
  "/",
  protect,
  restrictTo("admin", "superadmin"),
  uploadCategoryMiddleware.single("image"),
  createCategory
);

router.put(
  "/:id",
  protect,
  restrictTo("admin", "superadmin"),
  uploadCategoryMiddleware.single("image"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin", "superadmin"),
  deleteCategory
);

router.post(
  "/seed",
  protect,
  restrictTo("admin", "superadmin"),
  seedCategories
);

router.patch(
  "/update-product-count",
  protect,
  restrictTo("admin", "superadmin"),
  updateProductCount
);

export default router;