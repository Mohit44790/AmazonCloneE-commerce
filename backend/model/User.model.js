import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true,
    },

    phone: {
      type: String,
      trim: true,

      validate: {
        validator: function (v) {
          return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
        },

        message: "Please provide a valid phone number",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,

      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          );
        },

        message:
          "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      },
    },

    role: {
      type: String,

      enum: {
        values: [
          "customer",
          "seller",
          "admin",
          "superadmin",
        ],

        message:
          "Role must be: customer, seller, admin, or superadmin",
      },

      default: "customer",
    },

    avatar: {
      public_id: {
        type: String,
        default: null,
      },

      url: {
        type: String,

        default:
          "https://res.cloudinary.com/default/image/upload/v1/avatars/default-avatar.png",
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    banReason: {
      type: String,
      default: null,
    },

    // Seller specific
    sellerProfile: {
      shopName: String,

      shopDescription: String,

      shopLogo: {
        public_id: String,
        url: String,
      },

      shopBanner: {
        public_id: String,
        url: String,
      },

      gstNumber: String,

      panNumber: String,

      bankAccount: {
        accountNumber: {
          type: String,
          select: false,
        },

        ifscCode: {
          type: String,
          select: false,
        },

        bankName: String,

        accountHolderName: String,
      },

      isVerified: {
        type: Boolean,
        default: false,
      },

      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      totalSales: {
        type: Number,
        default: 0,
      },

      totalRevenue: {
        type: Number,
        default: 0,
      },
    },

    // Customer specific
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],

    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    // Security
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: {
      type: String,
      select: false,
    },

    // Tokens
    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    refreshTokens: [
      {
        token: {
          type: String,
          select: false,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },

        userAgent: String,

        ip: String,
      },
    ],

    phoneOtp: {
      type: String,
      select: false,
    },

    phoneOtpExpires: {
      type: Date,
      select: false,
    },

    // Stats
    lastLogin: {
      type: Date,
      default: null,
    },

    lastLoginIp: {
      type: String,
      default: null,
    },

    loginHistory: [
      {
        ip: String,

        userAgent: String,

        timestamp: {
          type: Date,
          default: Date.now,
        },

        success: Boolean,
      },
    ],

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    // Preferences
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },

        sms: {
          type: Boolean,
          default: false,
        },

        push: {
          type: Boolean,
          default: true,
        },
      },

      language: {
        type: String,
        default: "en",
      },

      currency: {
        type: String,
        default: "INR",
      },
    },

    passwordChangedAt: Date,

    deletedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,

    toJSON: {
      virtuals: true,

      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.loginAttempts;
        delete ret.lockUntil;
        delete ret.__v;

        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

// =============================================
// VIRTUAL FIELDS
// =============================================

userSchema.virtual("isLocked").get(function () {
  return !!(
    this.lockUntil &&
    this.lockUntil > Date.now()
  );
});

userSchema.virtual("fullName").get(function () {
  return this.name;
});

// =============================================
// INDEXES
// =============================================

userSchema.index({ email: 1 });

userSchema.index({ role: 1 });

userSchema.index({ createdAt: -1 });

userSchema.index({
  "sellerProfile.isVerified": 1,
});

// =============================================
// PRE SAVE HOOKS
// =============================================

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const saltRounds =
    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({
    deletedAt: null,
    isBanned: {
      $ne: true,
    },
  });

  next();
});

// =============================================
// INSTANCE METHODS
// =============================================

userSchema.methods.comparePassword =
  async function (candidatePassword) {
    return await bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

userSchema.methods.changedPasswordAfter =
  function (jwtTimestamp) {
    if (this.passwordChangedAt) {
      const changedAt = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );

      return jwtTimestamp < changedAt;
    }

    return false;
  };

userSchema.methods.createPasswordResetToken =
  function () {
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires =
      Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

userSchema.methods.createEmailVerificationToken =
  function () {
    const token = crypto
      .randomBytes(32)
      .toString("hex");

    this.emailVerificationToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    this.emailVerificationExpires =
      Date.now() + 24 * 60 * 60 * 1000;

    return token;
  };

userSchema.methods.createPhoneOtp =
  function () {
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  
    this.phoneOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    this.phoneOtpExpires =
      Date.now() +
      parseInt(process.env.OTP_EXPIRES_IN || 10) *
        60 *
        1000;

    return otp;
  };

userSchema.methods.incrementLoginAttempts =
  async function () {
    if (
      this.lockUntil &&
      this.lockUntil < Date.now()
    ) {
      return await this.updateOne({
        $unset: {
          lockUntil: 1,
        },

        $set: {
          loginAttempts: 1,
        },
      });
    }

    const updates = {
      $inc: {
        loginAttempts: 1,
      },
    };

    if (
      this.loginAttempts + 1 >= 5 &&
      !this.isLocked
    ) {
      updates.$set = {
        lockUntil:
          Date.now() + 2 * 60 * 60 * 1000,
      };
    }

    return await this.updateOne(updates);
  };

userSchema.methods.resetLoginAttempts =
  async function () {
    return await this.updateOne({
      $set: {
        loginAttempts: 0,
      },

      $unset: {
        lockUntil: 1,
      },
    });
  };

// Soft delete
userSchema.methods.softDelete =
  async function () {
    this.deletedAt = new Date();

    this.isActive = false;

    this.email = `deleted_${Date.now()}_${this.email}`;

    await this.save({
      validateBeforeSave: false,
    });
  };

// =============================================
// STATIC METHODS
// =============================================

userSchema.statics.findByEmail =
  function (email) {
    return this.findOne({
      email: email.toLowerCase().trim(),
    });
  };

const User = mongoose.model(
  "User",
  userSchema
);

export default User;