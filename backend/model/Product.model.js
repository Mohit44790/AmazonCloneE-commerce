import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            reuired:[true, "Product name is required"],
            trim:true,
            min
        }
    }
)