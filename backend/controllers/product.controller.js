

// =============================================
// GET ALL PRODUCTS
// =============================================

import { deleteMultipleFromCloudinary } from "../cloudinaryConfig/cloudinary";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import Category from "../model/Category.model";
import Product from "../model/Product.model";
import { APIFeatures } from "../utils/apiFeatures";

export const getAllProducts = catchAsync(
    async(req,res,next ) =>{
        const filter = {
            isActive:true,
            adminApproved:true,
        };

        //Category filter
        if(req.query.category){
            const cat = await Category.findOne({$or:[{slug:req.query.category,},{_id:req.query.category},]});
           
            if(cat) {
                const descendants = await Category.find({"ancestors._id":cat._id});

                const catIds =[
                    cat._id,...descendants.map((d) =>d._id)
                ];

                filter.$or = [
                    {category:{$in:catIds}},
                    {
                        subSubCategory:{
                            $in:catIds,
                        },
                    },
                    {categoryPath:{
                        $in:catIds,
                    },},
                ];
            }
        }

        if(req.query.gender){
            filter.gender = req.query.gender;
        }

        if(req.query.brand){
            filter.brand ={$regex:req.query.brand,$options:"i",};
        }

        if(req.query.seller){
            filter.seller = req.query.seller;
        }

       if (
      req.query.isFeatured ===
      "true"
    ) {
      filter.isFeatured = true;
    }

        if(req.query.isNewArrival ==="ture"){
            filter.isNewArrival = true;
        }

        if(req.query.isBestSeller === "ture"){
            filter.isBestSeller = true;
        }

        if(req.query.isDeal === "true"){
            filter.isDeal = true;
             filter.dealExpiresAt = {
        $gt: new Date(),
      };
    
        }
          if (
      req.query.inStock ===
      "true"
    ) {
      filter.stock = {
        $gt: 0,
      };
    }

     if (req.query.status) {
      filter.status =
        req.query.status;
    }
     // Size filter
    if (req.query.size) {
      filter.sizes = {
        $in:
          req.query.size.split(
            ","
          ),
      };
    }

    // Build features
    const features = new APIFeatures(Product.find(filter).populate("seller","name sellerProfile.shopNam sellerProfile.rating"),
req.query
).search([
    "name",
    "brand",
    "description",
]).priceRange()
   .ratingFilter()
   .sort()
   .limitFields()
   .paginate(20);

   //Count before pagination

   const countFeatures = new APIFeatures(Product.find(filter),req.query)
   .search([
    "name",
    "brand",
    "description",
   ])
   .priceRange()
   .ratingFilter();

   const [
    products,
    totalCount,
   ] = await Promise.all([
    features.query,

    Product.countDocuments(
        countFeatures.query.getFilter()
    ),
   ]);

   res.status(200).json({
    success:true,

    pagination:features.getPaginationMeta(
        totalCount
    ),
    data:{
        products,
    },
   });
    }
);

// =============================================
// GET SINGLE PRODUCT
// =============================================

export const getProduct = catchAsync(
    async(req,res,next) =>{
        const {id} = req.params;

      const query =
      id.match(
        /^[0-9a-fA-F]{24}$/
      )
        ? { _id: id }
        : { slug: id };

        const product = await Product.findOne({
            ...query, isActive:true,
        }).populate("category","name slug ancestirs")
        .populate(
          "subCategory",
          "name slug"
        )
        .populate(
          "subSubCategory",
          "name slug"
        )
         .populate(
          "seller",
          "name sellerProfile.shopName sellerProfile.rating sellerProfile.isVerified sellerProfile.totalSales createdAt"
        )
        .populate({
            path:"reviews",

            match:{
                isApproved:true,
            },
            options:{
                sort:{
                    createAt:-1,
                },
                limit:10,
            },
            populate:{
                path:"user",

                select:"namr avatar",
            }
        });

           if (!product) {
      return next(
        new AppError(
          "Product not found.",
          404
        )
      );
    }

    // Increment view count
    Product.findByIdAndUpdate(
      product._id,
      {
        $inc: {
          viewCount: 1,
        },
      }
    ).exec();

    // Related products
    const relatedProducts =
      await Product.find({
        category:
          product.category,

        _id: {
          $ne: product._id,
        },

        isActive: true,

        adminApproved: true,
      })
        .limit(8)
        .select(
          "name price comparePrice discount images rating slug"
        )
        .lean();

    res.status(200).json({
      success: true,

      data: {
        product,
        relatedProducts,
      },
    });
  }

    
)

// =============================================
// CREATE PRODUCT (Seller/Admin)
// =============================================


export const createProduct = catchAsync(async(req,res,next) =>{
     const {
    name, description, shortDescription, price, comparePrice, category,
    subCategory, subSubCategory, brand, stock, hasVariants, variants,
    attributes, sizes, colors, gender, ageGroup, tags, shipping,
    returnPolicy, warranty, seo, highlights, status,
  } = req.body;
 
  // Build category path
  let categoryPath = [];
  if (category) {
    const cat = await Category.findById(category);
    if (!cat) return next(new AppError("Category not found.", 404));
    categoryPath = [...cat.ancestors.map((a) => a._id), cat._id];
  }
 
  // Process uploaded images
  const images = [];
  if (req.files?.images) {
    req.files.images.forEach((file, index) => {
      images.push({
        public_id: file.filename || file.public_id,
        url: file.path,
        isPrimary: index === 0,
        order: index,
      });
    });
  }
 
  // Process uploaded videos
  const videos = [];
  if (req.files?.video) {
    req.files.video.forEach((file) => {
      videos.push({ public_id: file.filename, url: file.path });
    });
  }
 
  // Generate SKU
  const sku = req.body.sku || generateSKU(name, brand);
 
  const sellerId = req.user.role === "seller" ? req.user._id : (req.body.seller || req.user._id);
 
  const product = await Product.create({
    name, description, shortDescription, highlights,
    price: parseFloat(price),
    comparePrice: comparePrice ? parseFloat(comparePrice) : null,
    category, subCategory, subSubCategory, categoryPath,
    seller: sellerId,
    brand, stock: parseInt(stock) || 0,
    sku, images, videos,
    hasVariants: hasVariants === "true" || hasVariants === true,
    variants: variants ? (typeof variants === "string" ? JSON.parse(variants) : variants) : [],
    attributes: attributes ? (typeof attributes === "string" ? JSON.parse(attributes) : attributes) : [],
    sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : [],
    colors: colors ? (typeof colors === "string" ? JSON.parse(colors) : colors) : [],
    gender, ageGroup,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
    shipping: shipping ? (typeof shipping === "string" ? JSON.parse(shipping) : shipping) : {},
    returnPolicy: returnPolicy ? (typeof returnPolicy === "string" ? JSON.parse(returnPolicy) : returnPolicy) : {},
    warranty: warranty ? (typeof warranty === "string" ? JSON.parse(warranty) : warranty) : {},
    seo: seo ? (typeof seo === "string" ? JSON.parse(seo) : seo) : {},
    status: req.user.role === "admin" || req.user.role === "superadmin" ? (status || "active") : "draft",
    adminApproved: req.user.role === "admin" || req.user.role === "superadmin",
  });
 
  res.status(201).json({
    success: true,
    message: "Product created successfully." + (product.status === "draft" ? " Awaiting admin approval." : ""),
    data: { product },
  });
});

// =============================================
// UPDATE PRODUCT
// =============================================

export const updateProduct = catchAsync(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product) return next(new AppError("Product not found.",404));

    //only seller owner or admin can update
    if(req.user.role === "seller" && product.seller.toString() !== req.user._id.toString()){
        return next(new AppError("You can Only update your own products." ,403));
    }

    //handle new image uploads
    if(req.files?.images){
        const newImages = req.files.images.map((file,index) =>({
            public_id: file.filename || file.public_id,
            url:file.path,
            isPrimary:false,
            order:Product.images.length +index,
        }));
        product.images.push(...newImages)
    }

    //handle image deletions
    if(req.body.deleteImages){
        const toDelete = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];
        const imagesToDelete = product.images.filter((img) => toDelete.includes(img.public_id));

        if(imagesToDelete.length >0){
            await deleteMultipleFromCloudinary(imagesToDelete.map((img) => img.public_id));

            product.images = product.images.filter((img) => !toDelete.includes(img.public_id));
        }
    }

    // Update allowed fields
    const allowedUpdates = [
    "name", "description", "shortDescription", "highlights", "price", "comparePrice",
    "brand", "stock", "hasVariants", "variants", "attributes", "sizes", "colors",
    "gender", "ageGroup", "tags", "shipping", "returnPolicy", "warranty", "seo",
    "isFeatured", "isNewArrival", "isDeal", "dealExpiresAt",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      let val = req.body[field];
      if (["variants", "attributes", "shipping", "returnPolicy", "warranty", "seo"].includes(field)) {
        val = typeof val === "string" ? JSON.parse(val) : val;
      }
      product[field] = val;
    }
  });

  // Admin can update status and approval
  if(["admin" ,"superadmin"].includes(req.user.role)){
    if(req.body.status) product.status = req.body.status;
        if (req.body.adminApproved !== undefined) product.adminApproved = req.body.adminApproved;
    if (req.body.adminNote) product.adminNote = req.body.adminNote;
    if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured === "true";
    if (req.body.isBestSeller !== undefined) product.isBestSeller = req.body.isBestSeller === "true";

  }
  await product.save();

  res.status(200).json({
    success:true,
    message:"Product update successfully.",
    data:{product},
  });

});

// =============================================
// DELETE PRODUCT
// =============================================
export const deleteProduct = catchAsync(async(req,res,next)=>{
  const product = await Product.findById(req.params.id);
  if(!product) return next(new AppError("Product not found.",404));

  if(req.user.role === "seller" && product.seller.toString() !== req.user._id.toString()){
    return next(new AppError("You can only delete your own products.",403));

  }

  //Delete images from cloudinary
  if(product.images.length > 0){
    const publicIds = product.images.map((img) => img.public_id);
    await deleteMultipleFromCloudinary(publicIds).catch((e) => console.error("Cloudinary delete error:"e));

  }
  //delete videos
  if(product.videos.length > 0){
    const videoIds = product.videos.map((v) => v.publilc_id);
    await deleteMultipleFromCloudinary(videoIds ,"video").catch((e) => console.error("Video delete error:",e));

  }

  await product.deleteOne();

  res.status(200).json({success:true,message:"Product delete successfully."});
});

// =============================================
// GET SELLER'S OWN PRODUCTS
// =============================================
export const getMyProduct = catchAsync(async(req,res,next)=>{
  const features = new APIFeatures(
    Product.find({seller:req.user._id}),
    req.query
  ).filter()
  .search(["name","brand"])
  .sort()
  .paginate(20);

  const [products,total] = await Promise.all([
    features.query.populate("category","name slug"),
    Product.countDocuments({seller:req.user._id}),
    ]);
 
  res.status(200).json({
    success: true,
    pagination: features.getPaginationMeta(total),
    data: { products },
  });
});

// =============================================
// APPROVE PRODUCT (Admin)
// =============================================
export const approveProduct = catchAsync(async (req, res, next) => {
  const { approved, rejectionReason, adminNote } = req.body;
  const product = await Product.findById(req.params.id).populate("seller", "email name");
 
  if (!product) return next(new AppError("Product not found.", 404));
 
  product.adminApproved = approved;
  product.status = approved ? "active" : "inactive";
  if (!approved) product.rejectionReason = rejectionReason;
  if (adminNote) product.adminNote = adminNote;
 
  await product.save({ validateBeforeSave: false });
 
  // TODO: Notify seller via email/notification
 
  res.status(200).json({
    success: true,
    message: `Product ${approved ? "approved" : "rejected"} successfully.`,
    data: { product },
  });
});

// =============================================
// GET PRODUCT STATS (Admin/Seller)
// =============================================