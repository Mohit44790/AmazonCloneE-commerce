import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   product:{type:mongoose.Schema.Types.ObjectId, ref:"Product" , required:true},
   seller:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
   name:{type:String, required:true},
   image:String,
   price:{type:Number, required:true},
   quantity:{type:Number, required:true},
   variant:{
    size:String,
    color:String,
    other:String,
   },
   sku:String,

  // Per-item status for multi-seller orders

  itemStatus:{
    type:String,
    enum:["pending","confirmed","processing","shipped","delivered","cancelled","returned","refunded"]
  }
})