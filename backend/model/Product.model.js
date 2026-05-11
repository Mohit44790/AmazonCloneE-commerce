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
    }
)