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
    .isLength({
      min: 2,
      max: 50,
    }),

  body("email")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .isLength({
      min: 8,
    })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    )
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),

  body("phone")
    .optional()
    .isMobilePhone(),

  validate,
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .notEmpty(),

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