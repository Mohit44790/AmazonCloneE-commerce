import jwt from "jsonwebtoken";
import crypto from "crypto";

// =============================================
// TOKEN GENERATION
// =============================================

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role,
      type: "access",
    },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",

      issuer: "amazon-clone",

      audience: "amazon-clone-client",
    }
  );
};

const generateRefreshToken = (userId) =>{
    return jwt.sign(
        {
            id:userId,
            type:"refresh",
        },
        process.env.JWT_REFRESH_SECRET,
        {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN ||
        "30d",

      issuer: "amazon-clone",
    }
    );
};

const generateEmailToken = () =>{
    return crypto.randomBytes(32).toString("hex");
};

// =============================================
// TOKEN VERIFICATION
// =============================================

const verifyAccessToken = (token) =>{
    return jwt.verify(
        token, 
        process.env.JWT_SECRET,
        {
            issuer:"amazon-clone",
            audience:"amazon-clone-client",
        }
    );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET,

    {
      issuer: "amazon-clone",
    }
  );
};


// =============================================
// COOKIE OPTIONS
// =============================================

const getAccessTokenCookieOptions = () => ({
  httpOnly: true,

  secure:
    process.env.NODE_ENV === "production",

  sameSite:
    process.env.NODE_ENV === "production"
      ? "strict"
      : "lax",

  maxAge:
    parseInt(
      process.env.JWT_COOKIE_EXPIRES_IN || 7
    ) *
    24 *
    60 *
    60 *
    1000,

  path: "/",
});

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,

  secure:
    process.env.NODE_ENV === "production",

  sameSite:
    process.env.NODE_ENV === "production"
      ? "strict"
      : "lax",

  maxAge:
    30 * 24 * 60 * 60 * 1000,

  path: "/api/v1/auth/refresh",
});

// =============================================
// SEND TOKENS
// =============================================

const sendTokenResponse = (
  user,
  statusCode,
  res,
  message = "Success"
) => {
  const accessToken = generateAccessToken(
    user._id,
    user.role
  );

  const refreshToken = generateRefreshToken(
    user._id
  );

  res.cookie(
    "accessToken",
    accessToken,
    getAccessTokenCookieOptions()
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    getRefreshTokenCookieOptions()
  );

  // Remove sensitive fields
  const userData = user.toObject
    ? user.toObject()
    : user;

  delete userData.password;
  delete userData.refreshTokens;
  delete userData.__v;

  return res.status(statusCode).json({
    success: true,

    message,

    accessToken,

    data: {
      user: userData,
    },
  });
};

const clearTokenCookies = (res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyAccessToken,
  verifyRefreshToken,
  sendTokenResponse,
  clearTokenCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
};