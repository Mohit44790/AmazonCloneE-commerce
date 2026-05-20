import express from "express";
import { uploadProductImages } from "../cloudinaryConfig/cloudinary";
import { optionalAuth, protect, restrictTo, restrictToSeller } from "../middlewares/errorHandler";
import { approveProduct, createProduct, deleteProduct, getAllProducts, getMyProduct, getProducStats, getProduct, searchSuggestions, updateProduct } from "../controllers/product.controller";

const router = express.Router();

const uploadFields = uploadProductImages.fields([
    {name:"images" , maxCount:10},
]);

router.get("/" , optionalAuth, getAllProducts);
router.get("/search/suggestions" ,searchSuggestions);
router.get("/my-products", protect, restrictTo("seller","admin","superadmin"),getMyProduct );
router.get("/stats" , protect,restrictTo("seller","admin","superadmin"), getProducStats);
router.get("/:id" , optionalAuth,getProduct);
router.post("/" ,protect,restrictTo("seller","admin","superadmin"),restrictToSeller,uploadFields, createProduct);
router.put("/:id" ,protect,restrictTo("seller","admin","superadmin"),uploadsFields, updateProduct);
router.delete("/:id", protect,restrictTo("seller","admin","superadmin"),deleteProduct);
router.patch("/:id/approve",protect,restrictTo("admin","superadmin"),approveProduct);

export default router;