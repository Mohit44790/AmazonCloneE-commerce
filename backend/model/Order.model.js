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
    enum:["pending","confirmed","processing","shipped","delivered","cancelled","returned","refunded"],
     default: "pending",
  },

   trackingNumber: String,
  trackingUrl: String,
  shippingCarrier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  returnRequestedAt: Date,
  returnReason: String,
  returnApprovedAt: Date,
  refundAmount: Number,
  refundedAt: Date,
  sellerNote: String,
});


const orderSchema = new mongoose.Schema({
  orderNumber:{
    type:String,
    unique:true,
    index:true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true
  },

  items:[orderItemSchema],

   // Address snapshot (stored at order time, not referenced)

   shippingAddress:{
    fullName:{type:String, required:true},
    phone:{type:String, required:true},
    addressLine1:{type:String, required:true},
    addressLine2:String,
    city:{type:String, required:true},
    state:{type:String, required:true},
    country:{type:String, required:true , default:"India"},
    pincode:{type:String, required:true},
    landmark:String,
    addressType:{type:String, enum:["home","work","other"], default:"home"},

   },

   billingAddress:{
    fullName:String,
    phone:String,
    addressLine1:String,
    addressLine2:String,
    city:String,
    state:String,
    country:String,
    pincode:String,
    sameAsShipping:{type:Boolean, default: true},
   },

  // Pricing
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 18 }, // GST %
    discount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    couponCode: String,
    total: { type: Number, required: true },
    totalInPaise: { type: Number }, // for Razorpay

    // Payment
    paymentMethod: {
      type:String,
      enum:["cod","stripe","razorpay","paypal","upi","netbanking" ,"wallet"],
      required:true,
    },
   paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
      index: true,
    },
     payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      stripePaymentIntentId: String,
      stripeChargeId: String,
      transactionId: String,
      paidAt: Date,
      gateway: String,
      gatewayResponse: mongoose.Schema.Types.Mixed,
    },


    // Order Status

})