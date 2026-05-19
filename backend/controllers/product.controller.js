

// =============================================
// GET ALL PRODUCTS
// =============================================

import { catchAsync } from "../middlewares/errorHandler";
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