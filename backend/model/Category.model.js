import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Category name is required"],
        trim: true,
        maxlength:[100, "Category name cannot exceed 100 characters"],

    },
    slug:{
        type:String, unique:true , lowercase:true
    },
    description:{
        type:String, maxlength:500
    },
    image:{
        public_id:String,
        url:String,
        alt:String,
    },
    banner:{
        public_id:String,
        url:String,
    },

    icon:String,

    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null,
        index:true,
    },

    ancestors:[
        {
            _id:{type:mongoose.Schema.Types.ObjectId, ref:"Category"},
            name:String,
            slug:String,
        }
    ],
     level:{type:Number , default:0},

     // Amazon-style categories

       type: {
      type: String,
      enum: ["fashion", "electronics", "home", "beauty", "sports", "books", "automotive", "grocery", "toys", "other"],
      default: "other",
    },

    gender:{
        type:String,
        enum:["men","women","unisex","kids",null],
        default:null,
    },

    // display 
    displayOrder:{
        type:Number,
        default:0
    },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    showInMenu: { type: Boolean, default: true },
    showInHome: { type: Boolean, default: false },

      // SEO
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    // Stats
    productCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
