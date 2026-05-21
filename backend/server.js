import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import connectDB from "./databaseConfig/database.js";
import logger from "./utils/logger.js";


// Route imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
/* ================= CONFIG ================= */




/* ================= DATABASE ================= */

await connectDB();
console.log("✅ DB connected, starting server...");



/* ================= APP ================= */

const app = express();



/* ================= SECURITY MIDDLEWARE ================= */

app.use(helmet());

app.use(cors({
   origin:
  process.env.FRONTEND_URL ||
  "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(hpp());

/* ================= RATE LIMIT ================= */

// ================= AUTH RATE LIMIT =================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  message:
    "Too many auth requests. Please try again later.",
});

/* ================= LOGGER ================= */

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ================= ROUTES ================= */

app.get("/" , (req, res) => {
    res.status(200).json({
        success:true,
        message: "Server Running Successfully"
    });
});

// ================= ROUTES =================
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/categories", categoryRoutes);
/* ================= ERROR HANDLER ================= */

app.use(notFound);          // 404 handler
app.use(errorHandler);

// app.use((err, req, res, next) => {
//   logger.error(err.stack);

//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });


/* ================= SERVER ================= */

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>{
    logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

/* ================= UNHANDLED ERRORS ================= */

process.on("unhandledRejection", (err) =>{
    logger.error("unhandledRejection:", err);

    process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);

  process.exit(1);
});
