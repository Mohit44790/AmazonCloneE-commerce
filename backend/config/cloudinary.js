import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// =============================================
// UPLOAD HELPERS  (stream-based, no temp files)
// =============================================

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

const uploadProductImage = (buffer, index = 0) =>
  uploadToCloudinary(buffer, {
    folder: `${process.env.CLOUDINARY_FOLDER || "app"}/products`,
    public_id: `product_${Date.now()}_${index}`,
    transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto:good" }],
  });

const uploadProductVideo = (buffer) =>
  uploadToCloudinary(buffer, {
    folder: `${process.env.CLOUDINARY_FOLDER || "app"}/product-videos`,
    resource_type: "video",
    public_id: `video_${Date.now()}`,
  });

const uploadAvatar = (buffer, userId = "user") =>
  uploadToCloudinary(buffer, {
    folder: `${process.env.CLOUDINARY_FOLDER || "app"}/avatars`,
    public_id: `avatar_${userId}_${Date.now()}`,
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto:good" }],
  });

const uploadCategoryImage = (buffer) =>
  uploadToCloudinary(buffer, {
    folder: `${process.env.CLOUDINARY_FOLDER || "app"}/categories`,
    public_id: `category_${Date.now()}`,
    transformation: [{ width: 800, height: 400, crop: "fill", quality: "auto:good" }],
  });

// =============================================
// MULTER — memory storage (no disk, no cloudinary pkg needed)
// =============================================

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only image files are allowed!"), false);
};

const videoFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only video files are allowed!"), false);
};

const mediaFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif",
    "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm",
  ];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only image/video files are allowed!"), false);
};

// All multer instances use memory storage — files go to req.files as buffers
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: mediaFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 11 },
});

const uploadAvatarMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const uploadCategoryMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

// =============================================
// CLOUDINARY DELETE UTILITIES
// =============================================

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

const deleteMultipleFromCloudinary = async (publicIds, resourceType = "image") => {
  try {
    return await cloudinary.api.delete_resources(publicIds, { resource_type: resourceType });
  } catch (error) {
    console.error("Error deleting multiple from Cloudinary:", error);
    throw error;
  }
};

const getOptimizedUrl = (publicId, options = {}) =>
  cloudinary.url(publicId, { fetch_format: "auto", quality: "auto", ...options });

export {
  cloudinary,
  upload,
  uploadAvatarMiddleware,
  uploadCategoryMiddleware,
  uploadToCloudinary,
  uploadProductImage,
  uploadProductVideo,
  uploadAvatar,
  uploadCategoryImage,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  getOptimizedUrl,
};