import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            reuired:[true, "Product name is required"],
            trim:true,
            minlength:[3, "Product name must be at least 3 characters"],
            maxlenght:[100, "Product name must be less than 100 characters"],
            index:true,
        },
        slug:{
            type:String, 
            unique:true,
            lowercase:true,
            index:true,

        },
        description:{
            type:String,
            required:[true, "Product description is required"],
            maxlenght:[5000, "Description cannot be more than 5000 characters"]
        },
        shortDescription:{
            type:String,
            maxlength:[500, "Short description cannot exceed 500  characters"]
        },
        highlight:[{type:String , maxlength:200}],

        //price 
        price:{
            type:Number,
            rrequired:[true, "Product price is required"],
            min:[0, "Price cannot be negative"],
        },
        comarePrice:{type:Number , min: 0 , default:null},
        costPrice:{type:Number , min:0 , default:null ,select:false},
        discount:{type:Number ,  min:0 , max:100 , default:0},
        discountType:{type:String , enum:["percentage", "fixed"], default:"percentage"},

         // Category hierarchy
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
      index: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

      // Example: Men > T-Shirts > Polo T-Shirts
    // categoryPath is an array for breadcrumb: [Men, T-Shirts, Polo]

    categoryPath:[{type:mongoose.Schema.Types.ObjectId ,ref:"Category"}],

    //seller
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "Seller is required"],
        index:true,
    },
    brand:{
        type:String,
        trim:true,
        maxlength:[50, "Brand name cannot exceed 50 characters"],
        index:true,

    },

    //media

    images:[
        {
            public_id:{type:String, required: true},
            url:{type:String, required:true},
            alt: String,
            isPrimary:{type:Boolean, default:false},
            order:{type:Number, default:0},
        }
    ],
    videos:[
        {
            public_id:{type:String, url:String , thumbnail:String, duration:Number},
        }
    ],

    // inventory

    stock:{
        type:Number,
        required:[true, "Stock quantity is required"],
        min:[0, "Stock cannot be negative"],
        default:0,
    },
      lowStockThreshold: { type: Number, default: 10 },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    barcode: { type: String, sparse: true },

       // Variants (size, color, etc.)
    hasVariants: { type: Boolean, default: false },
    variants: [
      {
        name: { type: String, required: true }, // e.g., "Color", "Size"
        options: [
          {
            value: String, // e.g., "Red", "XL"
            stock: { type: Number, default: 0 },
            price: Number, // Override price for this variant
            sku: String,
            images: [{ public_id: String, url: String }],
          },
        ],
      },
    ],
 
    // Product attributes (dynamic key-value pairs)
    attributes: [
      {
        name: String, // e.g., "Material", "Fit", "Occasion"
        value: String, // e.g., "Cotton", "Regular", "Casual"
      },
    ],

    // Fashion specific
    sizes: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "40", "42"],
      },
    ],
    colors: [{ name: String, hex: String, image: String }],
    gender: {
      type: String,
      enum: ["men", "women", "unisex", "boys", "girls", "kids", null],
      default: null,
    },
    ageGroup: {
      type: String,
      enum: ["adult", "teen", "kids", "infant", null],
      default: null,
    },

     // Ratings & Reviews
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },

     // Shipping
    shipping:{
        weight:Number,
        dimensions:{
            length:Number,
            width:Number,
            height:Number,
        },

        freeShipping:{type:Boolean, default:false},
        shippingClass:{type:String, default:0},
        estimatedDelivery:String,
    },

   //SEO
   status:{
    type:String,
    enum:["draft", "active", "inactive", "out_of_stock" , "discontinued"],
    default:"draft",
    index:true,
   },
     isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false },
    dealExpiresAt: { type: Date, default: null },

    // Tags
    tags: [{ type: String, lowercase: true, trim: true }],

     // Stats
    viewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
 
    // Admin
    adminApproved: { type: Boolean, default: false },
    adminNote: String,
    rejectionReason: String,

      // Return policy
    returnPolicy: {
      isReturnable: { type: Boolean, default: true },
      returnDays: { type: Number, default: 10 },
      returnConditions: String,
    },

     // Warranty
    warranty: {
      hasWarranty: { type: Boolean, default: false },
      warrantyPeriod: String,
      warrantyType: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }


    
);
// =============================================
// VIRTUAL FIELDS
// =============================================
productSchema.virtual("finalPrice").get(function () {
  if (!this.discount || this.discount === 0) return this.price;
  if (this.discountType === "percentage") {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return Math.max(0, this.price - this.discount);
});
 
productSchema.virtual("discountAmount").get(function () {
  return this.price - this.finalPrice;
});
 
productSchema.virtual("isInStock").get(function () {
  return this.stock > 0;
});
 
productSchema.virtual("isLowStock").get(function () {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});
 
productSchema.virtual("primaryImage").get(function () {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find((img) => img.isPrimary) || this.images[0];
});
 
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});
 
// =============================================
// INDEXES
// =============================================
productSchema.index({ name: "text", description: "text", tags: "text", brand: "text" });
productSchema.index({ category: 1, status: 1, isActive: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "rating.average": -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ gender: 1, category: 1 });
 
// =============================================
// PRE-SAVE HOOKS
// =============================================
productSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    let slug = slugify(this.name, { lower: true, strict: true });
    const existing = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    this.slug = slug;
  }
 
  // Auto-calculate discount if comparePrice is set
  if (this.comparePrice && this.comparePrice > this.price) {
    this.discount = Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
    this.discountType = "percentage";
  }
 
  // Set primary image if none set
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some((img) => img.isPrimary);
    if (!hasPrimary) this.images[0].isPrimary = true;
  }
 
  // Update status based on stock
  if (this.stock === 0 && this.status === "active") {
    this.status = "out_of_stock";
  } else if (this.stock > 0 && this.status === "out_of_stock") {
    this.status = "active";
  }
 
  next();
});
 
// =============================================
// STATIC METHODS
// =============================================
productSchema.statics.updateRating = async function (productId) {
  const Review = mongoose.model("Review");
  const stats = await Review.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), isApproved: true } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
        dist1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        dist2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        dist3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        dist4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        dist5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
      },
    },
  ]);
 
  if (stats.length > 0) {
    await this.findByIdAndUpdate(productId, {
      "rating.average": Math.round(stats[0].avgRating * 10) / 10,
      "rating.count": stats[0].numReviews,
      "rating.distribution.1": stats[0].dist1,
      "rating.distribution.2": stats[0].dist2,
      "rating.distribution.3": stats[0].dist3,
      "rating.distribution.4": stats[0].dist4,
      "rating.distribution.5": stats[0].dist5,
    });
  } else {
    await this.findByIdAndUpdate(productId, {
      "rating.average": 0,
      "rating.count": 0,
    });
  }
};

const Product = mongoose.model("Product", productSchema);

export default Product;