import express from "express";
import { optionalAuth, protect, restrictTo, restrictToSeller } from "../middlewares/errorHandler.js";
import { uploadProductImages } from "../cloudinaryConfig/cloudinary.js";
import { approveProduct, createProduct, deleteProduct, getAllProducts, getMyProduct, getProducStats, getProduct, searchSuggestions, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

const uploadFields = uploadProductImages.fields([
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },   // fix: was missing entirely
]);

router.get("/" , optionalAuth, getAllProducts);
router.get("/search/suggestions" ,searchSuggestions);
router.get("/my-products", protect, restrictTo("seller","admin","superadmin"),getMyProduct );
router.get("/stats" , protect,restrictTo("seller","admin","superadmin"), getProducStats);
router.get("/:id" , optionalAuth,getProduct);
router.post("/" ,protect,restrictTo("seller","admin","superadmin"),restrictToSeller,uploadFields, createProduct);
router.put("/:id" ,protect,restrictTo("seller","admin","superadmin"),uploadFields , updateProduct);
router.delete("/:id", protect,restrictTo("seller","admin","superadmin"),deleteProduct);
router.patch("/:id/approve",protect,restrictTo("admin","superadmin"),approveProduct);

export default router;