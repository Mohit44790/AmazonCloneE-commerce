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

categorySchema.virtual("children", {
    ref:"Category",
    localfield:"_id",
    foreignField:"parent",

});

categorySchema.index({parent:1, isActive:1});
categorySchema.index({slug:1});
categorySchema.index({type:1 , gender:1});

categorySchema.pre("save" ,async function (next) {
    if(this.isModified("name") || this.isNew){
        let slug = slugify(this.name, {lower:true, strict:true});
        const existing = await this.constructor.findOne({slug, _id: {$ne: this._id}});
        if(existing) slug = `${slug} - ${Date.now()}`;
        this.slug = slug;
    }

    if(this.isModified("parent") && this.parent) {
        const parent = await this.constructor.findById(this.parent);
        if (parent) {
            this.ancestors = [...parent.ancestors, {_id: parent._id, name:parent.name, slug:parent.slug},];
            this.level = parent.level + 1;
        }
    } else if(!this.parent){
        this.ancestors = [];
        this.level = 0;
    }
    next();
});

// Pre-populated category seeds for Amazon clone
categorySchema.statics.getSeedData = function() {
    return [
        // fashion men
        {name:"Men" ,slug}
    ]
}

categorySchema.statics.getSeedData = function () {
  return [
    // ===== FASHION - MEN =====
    { name: "Men", slug: "men", type: "fashion", gender: "men", level: 0, icon: "👔" },
    { name: "Men T-Shirts", slug: "men-t-shirts", type: "fashion", gender: "men", level: 1 },
    { name: "Men Polo T-Shirts", slug: "men-polo-t-shirts", type: "fashion", gender: "men", level: 2 },
    { name: "Men Round Neck T-Shirts", slug: "men-round-neck-t-shirts", type: "fashion", gender: "men", level: 2 },
    { name: "Men Shirts", slug: "men-shirts", type: "fashion", gender: "men", level: 1 },
    { name: "Men Casual Shirts", slug: "men-casual-shirts", type: "fashion", gender: "men", level: 2 },
    { name: "Men Formal Shirts", slug: "men-formal-shirts", type: "fashion", gender: "men", level: 2 },
    { name: "Men Jeans", slug: "men-jeans", type: "fashion", gender: "men", level: 1 },
    { name: "Men Slim Fit Jeans", slug: "men-slim-fit-jeans", type: "fashion", gender: "men", level: 2 },
    { name: "Men Trousers", slug: "men-trousers", type: "fashion", gender: "men", level: 1 },
    { name: "Men Shorts", slug: "men-shorts", type: "fashion", gender: "men", level: 1 },
    { name: "Men Ethnic Wear", slug: "men-ethnic-wear", type: "fashion", gender: "men", level: 1 },
    { name: "Men Jackets", slug: "men-jackets", type: "fashion", gender: "men", level: 1 },
    { name: "Men Shoes", slug: "men-shoes", type: "fashion", gender: "men", level: 1 },
 
    // ===== FASHION - WOMEN =====
    { name: "Women", slug: "women", type: "fashion", gender: "women", level: 0, icon: "👗" },
    { name: "Women Tops", slug: "women-tops", type: "fashion", gender: "women", level: 1 },
    { name: "Women Casual Tops", slug: "women-casual-tops", type: "fashion", gender: "women", level: 2 },
    { name: "Women Crop Tops", slug: "women-crop-tops", type: "fashion", gender: "women", level: 2 },
    { name: "Women Jeans", slug: "women-jeans", type: "fashion", gender: "women", level: 1 },
    { name: "Women Skinny Jeans", slug: "women-skinny-jeans", type: "fashion", gender: "women", level: 2 },
    { name: "Women Sarees", slug: "women-sarees", type: "fashion", gender: "women", level: 1 },
    { name: "Women Silk Sarees", slug: "women-silk-sarees", type: "fashion", gender: "women", level: 2 },
    { name: "Women Cotton Sarees", slug: "women-cotton-sarees", type: "fashion", gender: "women", level: 2 },
    { name: "Women Banarasi Sarees", slug: "women-banarasi-sarees", type: "fashion", gender: "women", level: 2 },
    { name: "Women Kurtis", slug: "women-kurtis", type: "fashion", gender: "women", level: 1 },
    { name: "Women Dresses", slug: "women-dresses", type: "fashion", gender: "women", level: 1 },
    { name: "Women Lehengas", slug: "women-lehengas", type: "fashion", gender: "women", level: 1 },
    { name: "Women Ethnic Wear", slug: "women-ethnic-wear", type: "fashion", gender: "women", level: 1 },
    { name: "Women Shoes", slug: "women-shoes", type: "fashion", gender: "women", level: 1 },
    { name: "Women Handbags", slug: "women-handbags", type: "fashion", gender: "women", level: 1 },
 
    // ===== ELECTRONICS =====
    { name: "Electronics", slug: "electronics", type: "electronics", level: 0, icon: "📱" },
    { name: "Mobile Phones", slug: "mobile-phones", type: "electronics", level: 1 },
    { name: "Smartphones", slug: "smartphones", type: "electronics", level: 2 },
    { name: "Feature Phones", slug: "feature-phones", type: "electronics", level: 2 },
    { name: "Tablets", slug: "tablets", type: "electronics", level: 1 },
    { name: "Laptops", slug: "laptops", type: "electronics", level: 1 },
    { name: "Gaming Laptops", slug: "gaming-laptops", type: "electronics", level: 2 },
    { name: "Business Laptops", slug: "business-laptops", type: "electronics", level: 2 },
    { name: "Televisions", slug: "televisions", type: "electronics", level: 1 },
    { name: "Smart TVs", slug: "smart-tvs", type: "electronics", level: 2 },
    { name: "LED TVs", slug: "led-tvs", type: "electronics", level: 2 },
    { name: "OLED TVs", slug: "oled-tvs", type: "electronics", level: 2 },
    { name: "Cameras", slug: "cameras", type: "electronics", level: 1 },
    { name: "Headphones", slug: "headphones", type: "electronics", level: 1 },
    { name: "Smart Watches", slug: "smart-watches", type: "electronics", level: 1 },
    { name: "Computer Accessories", slug: "computer-accessories", type: "electronics", level: 1 },
 
    // ===== AUTOMOTIVE =====
    { name: "Automotive", slug: "automotive", type: "automotive", level: 0, icon: "🚗" },
    { name: "Car Accessories", slug: "car-accessories", type: "automotive", level: 1 },
    { name: "Car Electronics", slug: "car-electronics", type: "automotive", level: 2 },
    { name: "Car Care", slug: "car-care", type: "automotive", level: 2 },
    { name: "Bike Accessories", slug: "bike-accessories", type: "automotive", level: 1 },
    { name: "Tyres", slug: "tyres", type: "automotive", level: 1 },
 
    // ===== HOME & KITCHEN =====
    { name: "Home & Kitchen", slug: "home-kitchen", type: "home", level: 0, icon: "🏠" },
    { name: "Kitchen Appliances", slug: "kitchen-appliances", type: "home", level: 1 },
    { name: "Furniture", slug: "furniture", type: "home", level: 1 },
    { name: "Bedding", slug: "bedding", type: "home", level: 1 },
    { name: "Home Decor", slug: "home-decor", type: "home", level: 1 },
  ];
};

const Category = mongoose.model("Category", categorySchema);
export default Category;