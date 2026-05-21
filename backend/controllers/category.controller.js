import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import { AppError, catchAsync } from "../middlewares/errorHandler.js";
import { uploadCategoryImage, deleteFromCloudinary } from "../config/cloudinary.js";

// =============================================
// GET ALL CATEGORIES
// =============================================
export const getAllCategories = catchAsync(async (req, res, next) => {
  const { parent, type, gender, featured, showInMenu, showInHome, tree } = req.query;

  const filter = { isActive: true };

  if (parent === "null" || parent === "root" || parent === "0") {
    filter.parent = null;
  } else if (parent) {
    filter.parent = parent;
  }

  if (type)                  filter.type       = type;
  if (gender)                filter.gender     = gender;
  if (featured === "true")   filter.isFeatured = true;
  if (showInMenu === "true") filter.showInMenu = true;
  if (showInHome === "true") filter.showInHome = true;

  let query = Category.find(filter).sort("displayOrder name");

  if (tree !== "false") {
    query = query.populate({
      path:    "children",
      match:   { isActive: true },
      options: { sort: { displayOrder: 1, name: 1 } },
      populate: {
        path:    "children",
        match:   { isActive: true },
        options: { sort: { displayOrder: 1, name: 1 } },
      },
    });
  }

  const categories = await query;

  res.status(200).json({
    success: true,
    count:   categories.length,
    data:    { categories },
  });
});

// =============================================
// GET SINGLE CATEGORY BY SLUG OR ID
// =============================================
export const getCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const query = slug.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: slug }
    : { slug };

  const category = await Category.findOne({ ...query, isActive: true })
    .populate({
      path:    "children",
      match:   { isActive: true },
      options: { sort: { displayOrder: 1 } },
      populate: {
        path:    "children",
        match:   { isActive: true },
        options: { sort: { displayOrder: 1 } },
      },
    });

  if (!category) return next(new AppError("Category not found.", 404));

  res.status(200).json({
    success: true,
    data:    { category },
  });
});

// =============================================
// CREATE CATEGORY (Admin)
// =============================================
export const createCategory = catchAsync(async (req, res, next) => {
  const {
    name, description, parent, type, gender,
    displayOrder, isFeatured, showInMenu, showInHome,
    seo, icon,
  } = req.body;

  // Image upload — buffer → Cloudinary
  let image;
  if (req.file) {
    const result = await uploadCategoryImage(req.file.buffer);
    image = {
      public_id: result.public_id,
      url:       result.secure_url,
      alt:       name,
    };
  }

  const category = await Category.create({
    name,
    description,
    parent:       parent || null,
    type:         type || "other",
    gender:       gender || null,
    displayOrder: parseInt(displayOrder) || 0,
    isFeatured:   isFeatured === "true" || isFeatured === true,
    showInMenu:   showInMenu !== "false",
    showInHome:   showInHome === "true" || showInHome === true,
    image,
    icon,
    seo: seo ? (typeof seo === "string" ? JSON.parse(seo) : seo) : {},
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data:    { category },
  });
});

// =============================================
// UPDATE CATEGORY (Admin)
// =============================================
export const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found.", 404));

  const allowedUpdates = [
    "name", "description", "parent", "type", "gender",
    "displayOrder", "isFeatured", "showInMenu", "showInHome",
    "isActive", "icon", "seo",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      category[field] = field === "seo" && typeof req.body[field] === "string"
        ? JSON.parse(req.body[field])
        : req.body[field];
    }
  });

  // New image upload
  if (req.file) {
    if (category.image?.public_id) {
      await deleteFromCloudinary(category.image.public_id).catch(() => {});
    }
    const result = await uploadCategoryImage(req.file.buffer);
    category.image = {
      public_id: result.public_id,
      url:       result.secure_url,
      alt:       category.name,
    };
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    data:    { category },
  });
});

// =============================================
// DELETE CATEGORY (Admin)
// =============================================
export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found.", 404));

  const hasChildren = await Category.findOne({ parent: req.params.id });
  if (hasChildren) {
    return next(new AppError("Cannot delete category with subcategories. Delete children first.", 400));
  }

  const hasProducts = await Product.findOne({ category: req.params.id });
  if (hasProducts) {
    return next(new AppError("Cannot delete category that has products assigned to it.", 400));
  }

  if (category.image?.public_id) {
    await deleteFromCloudinary(category.image.public_id).catch(() => {});
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
});

// =============================================
// GET CATEGORY TREE (full nested tree)
// =============================================
export const getCategoryTree = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true, parent: null })
    .sort("displayOrder name")
    .populate({
      path:    "children",
      match:   { isActive: true },
      options: { sort: { displayOrder: 1 } },
      populate: {
        path:    "children",
        match:   { isActive: true },
        options: { sort: { displayOrder: 1 } },
      },
    });

  res.status(200).json({
    success: true,
    data:    { categories },
  });
});

// =============================================
// GET FEATURED CATEGORIES
// =============================================
export const getFeaturedCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    isActive:   true,
    isFeatured: true,
  }).sort("displayOrder").limit(12);

  res.status(200).json({
    success: true,
    data:    { categories },
  });
});

// =============================================
// GET CATEGORIES BY TYPE
// =============================================
export const getCategoriesByType = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  const validTypes = ["fashion", "electronics", "home", "beauty", "sports",
                      "books", "automotive", "grocery", "toys", "other"];

  if (!validTypes.includes(type)) {
    return next(new AppError(`Invalid category type: ${type}`, 400));
  }

  const categories = await Category.find({ type, isActive: true, parent: null })
    .sort("displayOrder")
    .populate({
      path:    "children",
      match:   { isActive: true },
      options: { sort: { displayOrder: 1 } },
    });

  res.status(200).json({
    success: true,
    data:    { categories },
  });
});

// =============================================
// GET MENU CATEGORIES (navbar use)
// =============================================
export const getMenuCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    isActive:   true,
    showInMenu: true,
    parent:     null,
  })
    .sort("displayOrder name")
    .select("name slug icon type gender displayOrder")
    .populate({
      path:    "children",
      match:   { isActive: true, showInMenu: true },
      options: { sort: { displayOrder: 1 } },
      select:  "name slug icon gender displayOrder",
      populate: {
        path:    "children",
        match:   { isActive: true },
        options: { sort: { displayOrder: 1 } },
        select:  "name slug gender",
      },
    });

  res.status(200).json({
    success: true,
    data:    { categories },
  });
});

// =============================================
// GET HOME CATEGORIES
// =============================================
export const getHomeCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    isActive:    true,
    showInHome:  true,
  })
    .sort("displayOrder")
    .limit(20)
    .select("name slug image icon type gender displayOrder");

  res.status(200).json({
    success: true,
    data:    { categories },
  });
});

// =============================================
// SEED CATEGORIES (Admin — run once)
// =============================================
export const seedCategories = catchAsync(async (req, res, next) => {
  const existing = await Category.countDocuments();
  if (existing > 0) {
    return next(new AppError("Categories already seeded. Delete all first to re-seed.", 400));
  }

  const seedData = Category.getSeedData();
  const created  = await Category.insertMany(seedData);

  res.status(201).json({
    success: true,
    message: `${created.length} categories seeded successfully.`,
    data:    { count: created.length },
  });
});

// =============================================
// UPDATE PRODUCT COUNT (Admin utility)
// =============================================
export const updateProductCount = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({
        $or: [
          { category:       cat._id },
          { subCategory:    cat._id },
          { subSubCategory: cat._id },
        ],
        isActive: true,
      });
      cat.productCount = count;
      await cat.save({ validateBeforeSave: false });
    })
  );

  res.status(200).json({
    success: true,
    message: "Product counts updated for all categories.",
  });
});

// =============================================
// GET BREADCRUMB for a category
// =============================================
export const getCategoryBreadcrumb = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const query = slug.match(/^[0-9a-fA-F]{24}$/) ? { _id: slug } : { slug };
  const category = await Category.findOne({ ...query, isActive: true });

  if (!category) return next(new AppError("Category not found.", 404));

  // ancestors already stored on the document
  const breadcrumb = [
    ...category.ancestors.map((a) => ({ name: a.name, slug: a.slug, _id: a._id })),
    { name: category.name, slug: category.slug, _id: category._id },
  ];

  res.status(200).json({
    success: true,
    data:    { breadcrumb },
  });
});