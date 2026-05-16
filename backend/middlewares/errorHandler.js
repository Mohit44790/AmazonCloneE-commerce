import crypto from 'crypto';
import User from '../model/User.model.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

// =============================================
// CUSTOM ERROR CLASS
// =============================================

class AppError extends Error {
    constructor (message, statusCode , errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = ` ${statusCode}`.startsWith("4") ? "fail" :"error";
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

// =============================================
// ERROR HANDLER MIDDLEWARE
// =============================================

const handleCastErrorDB = (err) =>
    new AppError('Invalid ${err.path} : ${err.value}', 400);

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return new AppError(`${field} '${value}' already exists. Please use a different value.`,400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message:e.message,
    }));

    return new AppError("Validation failed", 400, errors);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again." ,401);
const handleJWTExpiredError = () => new AppError("Your session has expired. Please log in again," ,401);

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        success:false,
        status: err.status,
        message: err.message,
        errors: err.errors,
        stack: err.stack,
        error:err,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success:false,
            status: err.status,
            message: err.message,
            ...(err.errors && { errors: err.errors}),
        });
    } else {
        logger.error("UNEXPECTED ERROR:", err);
        res.status(500).json({
            success:false,
            status: "error",
            message:"Something went wrong. Please try again later."
        });
    }
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    //handle multer errors
    if(err.code === "LIMIT_FILE_SIZE"){
        err = new AppError("File size too large. Maximum allowed size exceeded." ,400);
    }
    if (err.code === "LIMIT_FILE_COUNT"){
        err = new AppError("Too many files . Maximum count exceeded.", 400);

    }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
    err = new AppError("Unexpected file field.", 400);
  }

   if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message };
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
 
const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// =============================================
// AUTHENTICATION MIDDLEWARE
// =============================================
const protect = async (req, res, next) => {
  try {
    let token;
 
    // Get token from header or cookie
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
 
    if (!token) {
      return next(new AppError("You are not logged in. Please log in to get access.", 401));
    }
 
    // Verify token
    const decoded = verifyAccessToken(token);
 
    if (decoded.type !== "access") {
      return next(new AppError("Invalid token type.", 401));
    }
 
    // Check if user still exists
    const user = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!user) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }
 
    // Check if user is banned
    if (user.isBanned) {
      return next(new AppError(`Your account has been suspended. Reason: ${user.banReason || "Policy violation"}`, 403));
    }
 
    // Check if user is active
    if (!user.isActive) {
      return next(new AppError("Your account is deactivated. Please contact support.", 403));
    }
 
    // Check if password was changed after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("Your password was recently changed. Please log in again.", 401));
    }
 
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") return next(new AppError("Invalid token.", 401));
    if (error.name === "TokenExpiredError") return next(new AppError("Token expired. Please log in again.", 401));
    next(error);
  }
};
 
// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
 
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && !user.isBanned && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch {
    next(); // silently continue without user
  }
};

// =============================================
// ROLE-BASED ACCESS CONTROL
// =============================================

const ROLE_HIERARCHY = { customer:0 , seller:1, admin:2, superadmin:3};

const restrictTo = (...roles) =>{
    return (req,res,next) =>{
        if(!req.user){
            return next(new AppError("You are not logged in.",401));

        }
        if(!roles.includes(req.user.role)){
            return next(new AppError(`Access denied. Required role: ${roles.join(" or ")}`,403));

        }
        next();
    };
};

const requireMinRole = (minRole) => {
 return (req, res, next) => {
    if(!req.user) return next(new AppError("You are not logged in.",401));
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
    if(userLevel < requiredLevel){
        return next(new AppError("You do  not have permission to perform this action",403));
    }
    next();
 };
};

//seller ownership check
const restrictToSeller = async (req,res,next) => {
    try{
        if(req.user.role === "admin" || req.user.role === "superadmin") return next();

        if(req.user.role !== "seller") {
            return next (new AppError("Only sellers can perform this action.",403));
        }
        if(!req.user.sellerProfile?.isVerified){
            return next(new AppError("Your seller account is not yet verified.",403));

        }
        next();
    }catch(error){
        next(error);
    }
};

// =============================================
// OWNERSHIP MIDDLEWARE
// =============================================

const checkOwnership = (Model, paramField = "id" , ownerField = "user") =>{
    return async (req,res,next) =>{
        try{
            const doc = await Model.findById(req.params[paramField]);
            if(!doc) return next(new AppError("Resource not found.",401));

            const isOwner = doc[ownerField]?.toString()=== req.user._id.toString();
            const isAdmin = ["admin","superadmin"].includes(req.user.role);

            if(!isOwner && !isAdmin){
                return next(new AppError("You are not authorized to perform this action.",403));
            }
             req.doc = doc;
             next();
        }catch (error){
            next(error);
        }
    };
};

// =============================================
// SELLER EMAIL VERIFIED
// =============================================
const requireEmailVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return next(new AppError("Please verify your email address before continuing.", 403));
  }
  next();
};

// =============================================
// ASYNC WRAPPER
// =============================================
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// =============================================
// VALIDATION MIDDLEWARE (express-validator)
// =============================================
const { validationResult } = require("express-validator");
 
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
      value: e.value,
    }));
    return next(new AppError("Validation failed", 400, formattedErrors));
  }
  next();
};

export {
  AppError,
  errorHandler,
  notFound,
  protect,
  optionalAuth,
  restrictTo,
  requireMinRole,
  restrictToSeller,
  checkOwnership,
  requireEmailVerified,
  catchAsync,
  validate,
};
