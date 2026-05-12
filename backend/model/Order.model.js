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
    status:{
      type:String,
      enum:["pending","confirmed","processing","shipped","out_for_delivery","delivered","cancelled","returned","refunded"],
      default:"pending",
      index:true,
    },
    
       // Status history / timeline
    statusHistory: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

       // Dates
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    returnRequestedAt: Date,
    returnReason: String,
    returnApprovedAt: Date,
    refundedAt: Date,

    // Invoice
    invoiceNumber: { type: String, unique: true, sparse: true },
    invoiceUrl: String,
    invoiceGeneratedAt: Date,

        // Notes
    customerNote: { type: String, maxlength: 500 },
    adminNote: { type: String, maxlength: 500 },

    isGift: { type: Boolean, default: false },
    giftMessage: { type: String, maxlength: 200 },
        // Flags
    isReviewed: { type: Boolean, default: false },
    isCOD: { type: Boolean, default: false },
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

orderSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

orderSchema.virtual("sellerIds").get(function () {
  return [...new Set(this.items.map((item) => item.seller.toString()))];
});

// =============================================
// INDEXES
// =============================================

orderSchema.index({user:1 , createdAt:-1});
orderSchema.index({status:1 , createdAt:-1});
orderSchema.index({"items.seller":1 , status:1});
orderSchema.index({orderNumber:1});

// =============================================
// PRE-SAVE HOOKS
// =============================================
orderSchema.pre("save", async function (next) {
  if(this.isNew){
    // Generate order number: ORD-YYYYMMDD-XXXXXX
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,"");
    const random = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${dateStr}-${random}`;

    // Generate invoice number
    const invRandom = Math.floor(100000 + Math.random() * 900000);
    this.invoiceNumber = `INV-${dateStr}-${invRandom}`;

    //COD flag
    this.isCOD = this.paymentMethod === "cod";

    //Total in paise for Razorpay
    this.totalnPaise = Math.round(this.total * 100);

    // Add initial status to history
    this.statusHistory.push({
      status:"pending",
      message:"Order placed successfully",
    });
  }
  next();
});

// =============================================
// INSTANCE METHODS
// =============================================

orderSchema.methods.updateStatus = async function (status, message, updatedBy) {
  this.status = status;
  this.statusHistory.push({ status, message, updatedBy, timestamp: new Date() });
 
  const now = new Date();
  if (status === "confirmed") this.confirmedAt = now;
  if (status === "shipped") this.shippedAt = now;
  if (status === "delivered") {
    this.deliveredAt = now;
    if (this.isCOD) {
      this.paymentStatus = "paid";
      this.payment.paidAt = now;
    }
  }
  if (status === "cancelled") this.cancelledAt = now;
  if (status === "refunded") this.refundedAt = now;
 
  await this.save();
  return this;
};

const Order = mongoose.model("Order", orderSchema);
export default Order;