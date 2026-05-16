import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
 
// =============================================
// STORAGE CONFIGURATIONS
// =============================================

// Product images storage
const productStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: `${process.env.CLOUDINARY_FOLDER}/products`,

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "avif",
    ],

    transformation: [
      {
        width: 1200,
        height: 1200,
        crop: "limit",
        quality: "auto:good",
      },
      {
        fetch_format: "auto",
      },
    ],

    public_id: `product_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`,
  }),
});

// Product video storage
const productVideoStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: `${process.env.CLOUDINARY_FOLDER}/product-videos`,

    resource_type: "video",

    allowed_formats: [
      "mp4",
      "mov",
      "avi",
      "webm",
    ],

    transformation: [
      {
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],

    public_id: `video_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`,
  }),
});

// Avatar/Profile storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: `${process.env.CLOUDINARY_FOLDER}/avatars`,

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
      },
      {
        fetch_format: "auto",
      },
    ],

    public_id: `avatar_${req.user?.id || "user"}_${Date.now()}`,
  }),
});

// Category banner storage
const categoryStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: `${process.env.CLOUDINARY_FOLDER}/categories`,

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    transformation: [
      {
        width: 800,
        height: 400,
        crop: "fill",
        quality: "auto:good",
      },
    ],

    public_id: `category_${Date.now()}`,
  }),
});

// =============================================
// MULTER FILE FILTERS
// =============================================

const imageFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files (jpg, jpeg, png, webp) are allowed!"
      ),
      false
    );
  }
};

const videoFilter = (req, file, cb) => {
  const allowedMimes = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only video files (mp4, mov, avi, webm) are allowed!"
      ),
      false
    );
  }
};

const mediaFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",

    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image/video files are allowed!"),
      false
    );
  }
};

// =============================================
// MULTER UPLOAD INSTANCES
// =============================================

const uploadProductImages = multer({
  storage: productStorage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

const uploadProductVideo = multer({
  storage: productVideoStorage,

  fileFilter: videoFilter,

  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1,
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

const uploadCategoryImage = multer({
  storage: categoryStorage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

// =============================================
// CLOUDINARY UTILITIES
// =============================================

const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );

    return result;
  } catch (error) {
    console.error(
      "Error deleting from Cloudinary:",
      error
    );

    throw error;
  }
};

const deleteMultipleFromCloudinary = async (
  publicIds,
  resourceType = "image"
) => {
  try {
    const result =
      await cloudinary.api.delete_resources(
        publicIds,
        {
          resource_type: resourceType,
        }
      );

    return result;
  } catch (error) {
    console.error(
      "Error deleting multiple from Cloudinary:",
      error
    );

    throw error;
  }
};

const getOptimizedUrl = (
  publicId,
  options = {}
) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
};

export {
  cloudinary,
  uploadProductImages,
  uploadProductVideo,
  uploadAvatar,
  uploadCategoryImage,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  getOptimizedUrl,
};