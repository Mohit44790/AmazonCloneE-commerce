

// =============================================
// GET ALL CATEGORIES
// =============================================

import { deleteFromCloudinary, uploadCategoryImage } from "../config/cloudinary";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import Category from "../models/Category.model";

export const getAllCategories = catchAsync(async(req,res,next)=>{
   const { parent, type, gender, featured, showInMenu, showInHome, tree } = req.query;

  const filter = { isActive: true };


    if(parent === "null" || parent === "root" || parent === "0"){
        filter.parent = null;
    }else if (parent) {
        filter.parent = parent;
    }

    if(type)  filter.type = type;
    if(gender) filter.gender = gender;
    if(featured === "true") filter.isFeatured = true;
    if(showInMenu === "true") filter.showInMenu = true;
    if(showInHome === "true") filter.showInHome = true;

    let query = Category.find(filter).sort("displayOrder name");
    if(tree !== "false"){
        query = query.populate({
            path: "children",
            match:{isActive:true},
            options: {sort: {displayOrder: 1, name:1}},
            populate:{
                path: "children",
                match:{isActive:true},
                options:{sort:{displayOrder:1, name:1}}
            },
        });
    }

    const categories = await query;

    res.status(200).json({
        success:true,
        count:categories.length,
        data:{categories},
    })
})

// =============================================
// GET SINGLE CATEGORY BY SLUG OR ID
// =============================================

export const getCategory = catchAsync(async (req,res,next) =>{
    const {slug} = req.params;

    const query = slug.match(/^[0-9a-fA-F]{24}$/) ? {_id:slug} :{slug};

    const category = await Category.findOne({...query,isActive:true})
    .populate({
        path:"children",
        match:{isActive:true},
        options:{sort:{displayOrder:1}},
        populate:{
            path:"children",
            match:{isActive:true},
            options:{sort:{displayOrder:1}},

        },
    });

    if(!category) return next(new AppError("Category not found.",404));

    res.status(200).json({
        success:true,
        data:{category},
    })
});

// =============================================
// CREATE CATEGORY (Admin)
// =============================================

export const createCategory = catchAsync(async(req,res,next)=>{
    const {name,description,parent,type,gender,displayOrder,isFeatured,showInMenu,showInHome,seo,icon} = req.body;

    //image upload - buffer cloudinary
    let image;
    if(req.file){
        const result = await uploadCategoryImage(req.file.buffer);
        image ={
            public_id: result.public_id,
            url: result.secure_url,
            alt: name,
        };
    }

    const category = await Category.create({
        name, description,parent: parent || null, type: type || "order" , gender: gender || null, displayOrder:parseInt(displayOrder) || 0,
        isFeatured:isFeatured === "true" || isFeatured === true, showInMenu:   showInMenu !== "false",
    showInHome:   showInHome === "true" || showInHome === true,
    image,
    icon,
    seo: seo ? (typeof seo === "string" ? JSON.parse(seo) : seo) : {},
    });

    res.status(201).json({
        success:true,
        message:"Category create successfully.",
        data:{category}
    })
});

// =============================================
// UPDATE CATEGORY (Admin)
// =============================================

export const updateCategory = catchAsync(async(req,res,next)=>{
    const category = await Category.findById(req.params.id);
    if(!category) return next(new AppError("Category not found.",404));

    const allowedUpdates = [
        "name","description","parent","type","gender","displayOrder","isFeatured","showInMenu","showInHome","isActive","icon","seo"
    ];
    allowedUpdates.forEach((field) => {
        if(req.body[field] !== undefined){
            category[field] = field === "seo" && typeof req.body[field] === "string" ? JSON.parse(req.body[field]) : req.body[field];
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

    res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    data:    { category },
  });

});

// =============================================
// DELETE CATEGORY (Admin)
// =============================================