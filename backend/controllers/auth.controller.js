import crypto from "crypto";
import { AppError, catchAsync } from "../middlewares/errorHandler.js";
import User from "../models/User.model.js";
import { Cart } from "../models/extra.models.js";
import logger from "../utils/logger.js";
import {   sendTokenResponse,
  clearTokenCookies,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenCookieOptions,
  getAccessTokenCookieOptions,} from "../utils/tokenUtils.js";

  import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOtpEmail,
} from "../utils/sendEmail.js";
// =============================================
// REGISTER
// =============================================

export const register = catchAsync(
  async (req, res, next) => {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = req.body;

    // Prevent self-assignment of admin roles
    const allowedRoles = [
      "customer",
      "seller",
    ];

    const assignedRole =
      allowedRoles.includes(role)
        ? role
        : "customer";

    // Check if email already exists
    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      }).select("+password");

    if (existingUser) {
      return next(
        new AppError(
          "An account with this email already exists.",
          409
        )
      );
    }

    // Create user
    const user = await User.create({
      name: name.trim(),

      email: email
        .toLowerCase()
        .trim(),

      password,

      phone,

      role: assignedRole,
    });

    // Create empty cart for user
    await Cart.create({
      user: user._id,
    });

    // Send verification email
    try {
      const verificationToken =
        user.createEmailVerificationToken();

      await user.save({
        validateBeforeSave: false,
      });

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      await sendWelcomeEmail(
        user,
        verificationUrl
      );
    } catch (emailError) {
      logger.error(
        "Failed to send welcome email:",
        emailError
      );

      // Don't fail registration if email fails
    }

    // Log IP
    user.lastLogin = new Date();

    user.lastLoginIp = req.ip;

    user.loginHistory.push({
      ip: req.ip,

      userAgent:
        req.headers["user-agent"],

      success: true,
    });

    await user.save({
      validateBeforeSave: false,
    });

    logger.info(
      `New user registered: ${user.email} (${user.role})`
    );

    sendTokenResponse(
      user,
      201,
      res,
      "Account created successfully! Please verify your email."
    );
  }
);

// =============================================
// LOGIN
// =============================================

export const login = catchAsync(
  async (req, res, next) => {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return next(
        new AppError(
          "Please provide email and password.",
          400
        )
      );
    }

    // Find user with password
    const user = await User.findOne({
      email: email.toLowerCase(),
    })
      .select(
        "+password +loginAttempts +lockUntil +refreshTokens"
      )
      .lean(false);

    if (!user) {
      return next(
        new AppError(
          "Invalid email or password.",
          401
        )
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockTime = Math.ceil(
        (user.lockUntil - Date.now()) /
          60000
      );

      return next(
        new AppError(
          `Account temporarily locked due to multiple failed attempts. Try again in ${lockTime} minutes.`,
          423
        )
      );
    }

    // Check password
    const isPasswordCorrect =
      await user.comparePassword(
        password
      );

    if (!isPasswordCorrect) {
      await user.incrementLoginAttempts();

      user.loginHistory.push({
        ip: req.ip,

        userAgent:
          req.headers["user-agent"],

        success: false,
      });

      await user.save({
        validateBeforeSave: false,
      });

      return next(
        new AppError(
          "Invalid email or password.",
          401
        )
      );
    }

    // Reset login attempts on success
    await user.resetLoginAttempts();

    // Store refresh token
    const refreshToken =
      generateRefreshToken(user._id);

    user.refreshTokens =
      user.refreshTokens || [];

    // Limit stored refresh tokens to last 5 devices
    if (
      user.refreshTokens.length >= 5
    ) {
      user.refreshTokens.shift();
    }

    user.refreshTokens.push({
      token: refreshToken,

      userAgent:
        req.headers["user-agent"],

      ip: req.ip,
    });

    user.lastLogin = new Date();

    user.lastLoginIp = req.ip;

    user.loginHistory.push({
      ip: req.ip,

      userAgent:
        req.headers["user-agent"],

      success: true,
    });

    await user.save({
      validateBeforeSave: false,
    });

    logger.info(
      `User logged in: ${user.email}`
    );

    sendTokenResponse(
      user,
      200,
      res,
      "Logged in successfully."
    );
  }
);

// =============================================
// LOGOUT
// =============================================

export const logout = catchAsync(
  async (req, res, next) => {
    const refreshToken =
      req.cookies?.refreshToken;

    if (refreshToken && req.user) {
      // Remove current refresh token from DB
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            refreshTokens: {
              token: refreshToken,
            },
          },
        }
      );
    }

    clearTokenCookies(res);

    res.status(200).json({
      success: true,

      message:
        "Logged out successfully.",
    });
  }
);

// =============================================
// LOGOUT ALL DEVICES
// =============================================

export const logoutAll = catchAsync(
  async (req, res, next) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshTokens: [],
        },
      }
    );

    clearTokenCookies(res);

    res.status(200).json({
      success: true,

      message:
        "Logged out from all devices.",
    });
  }
);

// =============================================
// REFRESH ACCESS TOKEN
// =============================================

export const refreshToken =
  catchAsync(
    async (req, res, next) => {
      const token =
        req.cookies
          ?.refreshToken ||
        req.body?.refreshToken;

      if (!token) {
        return next(
          new AppError(
            "No refresh token provided.",
            401
          )
        );
      }

      let decoded;

      try {
        decoded =
          verifyRefreshToken(
            token
          );
      } catch {
        return next(
          new AppError(
            "Invalid or expired refresh token.",
            401
          )
        );
      }

      if (
        decoded.type !== "refresh"
      ) {
        return next(
          new AppError(
            "Invalid token type.",
            401
          )
        );
      }

      const user =
        await User.findById(
          decoded.id
        ).select(
          "+refreshTokens"
        );

      if (!user) {
        return next(
          new AppError(
            "User not found.",
            401
          )
        );
      }

      // Verify refresh token exists in DB
      const storedToken =
        user.refreshTokens?.find(
          (rt) =>
            rt.token === token
        );

      if (!storedToken) {
        // Token reuse detected
        await User.findByIdAndUpdate(
          decoded.id,
          {
            $set: {
              refreshTokens:
                [],
            },
          }
        );

        clearTokenCookies(res);

        return next(
          new AppError(
            "Session invalidated. Please log in again.",
            401
          )
        );
      }

      // Rotate refresh token
      const newRefreshToken =
        generateRefreshToken(
          user._id
        );

      const newAccessToken =
        generateAccessToken(
          user._id,
          user.role
        );

      // Replace old refresh token
      await User.findByIdAndUpdate(
        user._id,
        {
          $pull: {
            refreshTokens: {
              token,
            },
          },

          $push: {
            refreshTokens: {
              token:
                newRefreshToken,

              userAgent:
                req.headers[
                  "user-agent"
                ],

              ip: req.ip,
            },
          },
        }
      );

      res.cookie(
        "accessToken",
        newAccessToken,
        getAccessTokenCookieOptions()
      );

      res.cookie(
        "refreshToken",
        newRefreshToken,
        getRefreshTokenCookieOptions()
      );

      res.status(200).json({
        success: true,

        accessToken:
          newAccessToken,

        message:
          "Token refreshed.",
      });
    }
  );

// =============================================
// FORGOT PASSWORD
// =============================================

export const forgotPassword =
  catchAsync(
    async (req, res, next) => {
      const { email } =
        req.body;

      if (!email) {
        return next(
          new AppError(
            "Please provide your email address.",
            400
          )
        );
      }

      const user =
        await User.findOne({
          email: email.toLowerCase(),
        });

      // Always respond same message
      const successMsg =
        "If an account exists with that email, a password reset link has been sent.";

      if (!user) {
        return res.status(200).json({
          success: true,
          message: successMsg,
        });
      }

      const resetToken =
        user.createPasswordResetToken();

      await user.save({
        validateBeforeSave: false,
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      try {
        await sendPasswordResetEmail(
          user,
          resetUrl
        );

        logger.info(
          `Password reset email sent to: ${user.email}`
        );
      } catch (error) {
        user.passwordResetToken =
          undefined;

        user.passwordResetExpires =
          undefined;

        await user.save({
          validateBeforeSave: false,
        });

        return next(
          new AppError(
            "Failed to send reset email. Please try again later.",
            500
          )
        );
      }

      res.status(200).json({
        success: true,
        message: successMsg,
      });
    }
  );

// =============================================
// RESET PASSWORD
// =============================================

export const resetPassword =
  catchAsync(
    async (req, res, next) => {
      const { token } =
        req.params;

      const { password } =
        req.body;

      if (!password) {
        return next(
          new AppError(
            "Please provide a new password.",
            400
          )
        );
      }

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      const user =
        await User.findOne({
          passwordResetToken:
            hashedToken,

          passwordResetExpires:
            {
              $gt: Date.now(),
            },
        }).select("+password");

      if (!user) {
        return next(
          new AppError(
            "Password reset token is invalid or has expired.",
            400
          )
        );
      }

      user.password = password;

      user.passwordResetToken =
        undefined;

      user.passwordResetExpires =
        undefined;

      user.refreshTokens = [];

      await user.save();

      clearTokenCookies(res);

      res.status(200).json({
        success: true,

        message:
          "Password reset successfully. Please log in with your new password.",
      });
    }
  );

// =============================================
// VERIFY EMAIL
// =============================================

export const verifyEmail =
  catchAsync(
    async (req, res, next) => {
      const { token } =
        req.params;

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      const user =
        await User.findOne({
          emailVerificationToken:
            hashedToken,

          emailVerificationExpires:
            {
              $gt: Date.now(),
            },
        });

      if (!user) {
        return next(
          new AppError(
            "Email verification token is invalid or has expired.",
            400
          )
        );
      }

      user.isEmailVerified = true;

      user.emailVerificationToken =
        undefined;

      user.emailVerificationExpires =
        undefined;

      await user.save({
        validateBeforeSave: false,
      });

      res.status(200).json({
        success: true,

        message:
          "Email verified successfully!",
      });
    }
  );

// =============================================
// RESEND VERIFICATION EMAIL
// =============================================

export const resendVerificationEmail =
  catchAsync(
    async (req, res, next) => {
      const user = req.user;

      if (user.isEmailVerified) {
        return next(
          new AppError(
            "Email is already verified.",
            400
          )
        );
      }

      const verificationToken =
        user.createEmailVerificationToken();

      await user.save({
        validateBeforeSave: false,
      });

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      await sendWelcomeEmail(
        user,
        verificationUrl
      );

      res.status(200).json({
        success: true,

        message:
          "Verification email sent.",
      });
    }
  );

// =============================================
// CHANGE PASSWORD
// =============================================

export const changePassword =
  catchAsync(
    async (req, res, next) => {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return next(
          new AppError(
            "Please provide current and new password.",
            400
          )
        );
      }

      const user =
        await User.findById(
          req.user._id
        ).select("+password");

      const isCorrect =
        await user.comparePassword(
          currentPassword
        );

      if (!isCorrect) {
        return next(
          new AppError(
            "Current password is incorrect.",
            401
          )
        );
      }

      if (
        currentPassword ===
        newPassword
      ) {
        return next(
          new AppError(
            "New password must be different from current password.",
            400
          )
        );
      }

      user.password =
        newPassword;

      user.refreshTokens = [];

      await user.save();

      sendTokenResponse(
        user,
        200,
        res,
        "Password changed successfully."
      );
    }
  );

// =============================================
// GET CURRENT USER
// =============================================

export const getMe = catchAsync(
  async (req, res, next) => {
    const user =
      await User.findById(
        req.user._id
      )
        .populate("addresses")
        .populate(
          "defaultAddress"
        );

    res.status(200).json({
      success: true,

      data: {
        user,
      },
    });
  }
);


export const getAllUsers = catchAsync(async (req, res, next) => {
  const page  = Math.max(1,   parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 15);
  const skip  = (page - 1) * limit;

  const filter = {};

  if (req.query.role) filter.role = req.query.role;

  if (req.query.status) {
    if (req.query.status === "banned")   filter.isBanned  = true;
    if (req.query.status === "inactive") filter.isActive  = false;
    if (req.query.status === "active")   { filter.isActive = true; filter.isBanned = false; }
  }

  if (req.query.search) {
    const re = new RegExp(
      req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"
    );
    filter.$or = [{ name: re }, { email: re }];
  }

  const sortMap = {
    "-createdAt":   { createdAt:   -1 },
    "createdAt":    { createdAt:    1 },
    "name":         { name:         1 },
    "-name":        { name:        -1 },
    "-totalOrders": { totalOrders: -1 },
    "-totalSpent":  { totalSpent:  -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-password -refreshTokens -emailVerificationToken -passwordResetToken"),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      currentPage: page,
      totalPages:  Math.ceil(total / limit),
      totalCount:  total,
      limit,
    },
    data: { users },
  });
});

// =============================================
// GET SINGLE USER (Admin)
// =============================================
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password -refreshTokens -emailVerificationToken -passwordResetToken");

  if (!user) return next(new AppError("User not found.", 404));

  res.status(200).json({ success: true, data: { user } });
});

// =============================================
// GET MY PROFILE (Logged-in user)
// =============================================
// export const getMe = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user._id)
//     .select("-password -refreshTokens -emailVerificationToken -passwordResetToken");

//   res.status(200).json({ success: true, data: { user } });
// });

// =============================================
// UPDATE MY PROFILE
// =============================================
export const updateMe = catchAsync(async (req, res, next) => {
  const forbidden = ["password", "role", "isBanned", "adminApproved"];
  forbidden.forEach((f) => delete req.body[f]);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).select("-password -refreshTokens");

  res.status(200).json({ success: true, message: "Profile updated.", data: { user } });
});

// =============================================
// BAN USER (Admin)
// =============================================
export const banUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found.", 404));

  if (user.role === "superadmin")
    return next(new AppError("Cannot ban a superadmin.", 403));

  user.isBanned  = true;
  user.banReason = req.body.reason || "Banned by admin";
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "User banned successfully." });
});

// =============================================
// UNBAN USER (Admin)
// =============================================
export const unbanUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found.", 404));

  user.isBanned  = false;
  user.banReason = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "User unbanned successfully." });
});

// =============================================
// CHANGE ROLE (Super Admin only)
// =============================================
export const changeRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const validRoles = ["customer", "seller", "admin", "superadmin"];

  if (!validRoles.includes(role))
    return next(new AppError(`Invalid role. Must be one of: ${validRoles.join(", ")}`, 400));

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password -refreshTokens");

  if (!user) return next(new AppError("User not found.", 404));

  res.status(200).json({ success: true, message: "Role updated.", data: { user } });
});

// =============================================
// VERIFY SELLER (Admin)
// =============================================
export const verifySeller = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found.", 404));

  if (user.role !== "seller")
    return next(new AppError("User is not a seller.", 400));

  user.sellerProfile.isVerified = req.body.verified !== false;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Seller ${user.sellerProfile.isVerified ? "verified" : "unverified"}.`,
    data: { user },
  });
});

// =============================================
// DELETE USER (Super Admin)
// =============================================
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found.", 404));

  if (user.role === "superadmin")
    return next(new AppError("Cannot delete a superadmin.", 403));

  await user.softDelete();

  res.status(200).json({ success: true, message: "User deleted successfully." });
});

// =============================================
// GET USER STATS (Admin)
// =============================================
export const getUserStats = catchAsync(async (req, res, next) => {
  const [stats, roleBreakdown] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id:        null,
          total:      { $sum: 1 },
          active:     { $sum: { $cond: [{ $and: [{ $eq: ["$isActive", true] }, { $eq: ["$isBanned", false] }] }, 1, 0] } },
          banned:     { $sum: { $cond: ["$isBanned", 1, 0] } },
          verified:   { $sum: { $cond: ["$isEmailVerified", 1, 0] } },
          totalSpent: { $sum: "$totalSpent" },
        },
      },
    ]),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const newToday = await User.countDocuments({ createdAt: { $gte: todayStart } });

  res.status(200).json({
    success: true,
    data: {
      stats:         stats[0] || {},
      roleBreakdown,
      newToday,
    },
  });
});