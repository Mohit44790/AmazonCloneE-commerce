import mongoose from "mongoose";

// =============================================
// CART MODEL
// =============================================

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
    default: 1,
  },

  variant: {
    size: String,
    color: String,
    other: String,
  },

  priceAtAdd: Number,

  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [cartItemSchema],

    couponCode: {
      type: String,
      default: null,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
});

cartSchema.methods.addItem = async function (
  productId,
  quantity = 1,
  variant = {}
) {
  const existingIndex = this.items.findIndex(
    (item) =>
      item.product.toString() ===
        productId.toString() &&
      item.variant?.size === variant?.size &&
      item.variant?.color === variant?.color
  );

  if (existingIndex > -1) {
    this.items[existingIndex].quantity = Math.min(
      this.items[existingIndex].quantity + quantity,
      20
    );
  } else {
    this.items.push({
      product: productId,
      quantity,
      variant,
    });
  }

  this.lastActivity = new Date();

  return this.save();
};

cartSchema.methods.removeItem = async function (
  productId,
  variant = {}
) {
  this.items = this.items.filter(
    (item) =>
      !(
        item.product.toString() ===
          productId.toString() &&
        item.variant?.size === variant?.size &&
        item.variant?.color === variant?.color
      )
  );

  this.lastActivity = new Date();

  return this.save();
};

cartSchema.methods.updateQuantity =
  async function (
    productId,
    quantity,
    variant = {}
  ) {
    const item = this.items.find(
      (item) =>
        item.product.toString() ===
          productId.toString() &&
        item.variant?.size === variant?.size
    );

    if (item) {
      item.quantity = Math.min(
        Math.max(1, quantity),
        20
      );

      this.lastActivity = new Date();

      return this.save();
    }

    throw new Error("Item not found in cart");
  };

cartSchema.methods.clearCart = async function () {
  this.items = [];

  this.couponCode = null;

  this.couponDiscount = 0;

  return this.save();
};

const Cart = mongoose.model(
  "Cart",
  cartSchema
);

// =============================================
// WISHLIST MODEL
// =============================================

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        addedAt: {
          type: Date,
          default: Date.now,
        },

        note: {
          type: String,
          maxlength: 200,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

wishlistSchema.methods.addItem =
  async function (productId) {
    const exists = this.items.some(
      (item) =>
        item.product.toString() ===
        productId.toString()
    );

    if (!exists) {
      this.items.push({
        product: productId,
      });

      await this.save();
    }

    return this;
  };

wishlistSchema.methods.removeItem =
  async function (productId) {
    this.items = this.items.filter(
      (item) =>
        item.product.toString() !==
        productId.toString()
    );

    return this.save();
  };

wishlistSchema.methods.hasItem =
  function (productId) {
    return this.items.some(
      (item) =>
        item.product.toString() ===
        productId.toString()
    );
  };

const Wishlist = mongoose.model(
  "Wishlist",
  wishlistSchema
);

// =============================================
// REVIEW MODEL
// =============================================

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    body: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Review = mongoose.model(
  "Review",
  reviewSchema
);

// =============================================
// ADDRESS MODEL
// =============================================

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      required: true,
    },

    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },

  {
    timestamps: true,
  }
);

const Address = mongoose.model(
  "Address",
  addressSchema
);

// =============================================
// COUPON MODEL
// =============================================

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: String,

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const Coupon = mongoose.model(
  "Coupon",
  couponSchema
);

// =============================================
// NOTIFICATION MODEL
// =============================================

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,

      enum: [
        "order",
        "payment",
        "product",
        "review",
        "promotion",
        "account",
        "system",
      ],

      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: String,
  },

  {
    timestamps: true,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export {
  Cart,
  Wishlist,
  Review,
  Address,
  Coupon,
  Notification,
};