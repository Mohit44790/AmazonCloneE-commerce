import crypto from "crypto";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import User from "../model/User.model";
import { Cart } from "../model/extra.models";
import logger from "../utils/logger";
import { generateRefreshToken, sendTokenResponse } from "../utils/tokenUtils";

// =============================================
// REGISTER
// =============================================

export const register = catchAsync(async (req , res, next)=>{
    const {name,email,password,phone,role,} = req.body;

    const allowedRoles = [
        "customer","seller"
    ];
    const assignedRole = allowedRoles.includes(role) ? role : "customer";

    const existinigUser = await User.findOne({
        email:email.toLowerCase(),
    }).select("+password");

   if (existingUser) {
      return next(
        new AppError(
          "An account with this email already exists.",
          409
        )
      );
    }

    const user = await User.create({
        name: name.trim(),
        email:email
        .toLowerCase()
        .trim(),

        password,
        phone,
        role:assignedRole,
    });

    await Cart.create({
        user:user._id,
    });

    try {
        const verificationToken = user.createEmailVerificationToken();

        await user.save({
            validateBeforeSave:false,
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
    }
    user.lastLogin = new Date();
    user.lastLoginIp = req.ip;
    user.loginHistory.push({
        ip:req.ip,

        userAgent:req.headers["user-agent"],
        success:true,
    });

    await user.save({
        validateBeforeSave:false,
    });

    logger.info(
        `New user registered ;${user.email}`
    );
    sendTokenResponse(
        user,201,res,"Account create Successfully!"
    );
});

// =============================================
// LOGIN
// =============================================

export const login = catchAsync(async(req,res,next)=>{
    const {email,password} =req.body;

    if(!email || !password){
        return next(new AppError("Please provide email and password",400));
    }

    const user = await User.findOne({
        email:email.toLowerCase(),
    })
    .select("+password +loginAttempts +lockUntil +refreshTokens").lean(false);

    if(!user){
        return next(new AppError("Invalid email or password.",401));

    }
    if(user.isLocked){
        const lockTime = Math.ceil(
            (user.lockUntil - Date.now()) / 60000
        );

        return next(new AppError(`Account temporarily locked. Try again in ${lockTime} minutes.`,423));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) {
        await user.incrementLoginAttempts();

        user.loginHistory.push({
            ip:req.ip,

            userAgent:req.headers["user-agent"],

            success:false,
        });

        await user.save({
            validateBeforeSave:false,
        });

        await user.resetLoginAttempts();

        const refreshToken = generateRefreshToken(user._id);

        user.refreshTokens =
      user.refreshTokens || [];
    }
})