import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import connectDB from "./databaseConfig/database.js";
import logger from "./utils/logger.js";

/* ================= CONFIG ================= */

dotenv.config();

/* ================= DATABASE ================= */

await connectDB();

/* ================= APP ================= */

const app = express();

/* ================= SECURITY MIDDLEWARE ================= */

app.use(helmet());

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(hpp());

/* ================= RATE LIMIT ================= */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max : 200,
    message:"Too many requests from this IP, please try again after 15 minutes"
});

app.use(limiter);

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

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

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
