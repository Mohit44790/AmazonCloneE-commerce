// routes/auth.routes.js

import express from "express";
import { body } from "express-validator";

import {
  protect,
  validate,
} from "../middlewares/errorHandler.js";

import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  logoutAll,
  refreshToken,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

// =============================================
// VALIDATIONS
// =============================================

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage(
      "Name must be between 2 and 50 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 8,
    })
    .withMessage(
      "Password must be at least 8 characters"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    )
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage(
      "Please enter valid phone number"
    ),

  validate,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

  validate,
];

// =============================================
// AUTH ROUTES
// =============================================

router.post(
  "/register",
  registerValidation,
  register
);

router.post(
  "/login",
  loginValidation,
  login
);

router.post(
  "/logout",
  protect,
  logout
);

router.post(
  "/logout-all",
  protect,
  logoutAll
);

router.post(
  "/refresh-token",
  refreshToken
);

router.post(
  "/forgot-password",

  body("email")
    .isEmail(),

  validate,

  forgotPassword
);

router.patch(
  "/reset-password/:token",

  body("password")
    .isLength({
      min: 8,
    })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    ),

  validate,

  resetPassword
);

// FIXED: missing "/" before verify-email
router.get(
  "/verify-email/:token",
  verifyEmail
);

router.post(
  "/resend-verification",
  protect,
  resendVerificationEmail
);

router.patch(
  "/change-password",
  protect,

  body("currentPassword")
    .notEmpty(),

  body("newPassword")
    .isLength({
      min: 8,
    })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    ),

  validate,

  changePassword
);

router.get(
  "/me",
  protect,
  getMe
);

export default router;