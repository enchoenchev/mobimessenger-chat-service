const createError = require("http-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const logger = require("morgan");
const path = require("path");
const globalErrorHandler = require("./handlers/globalErrorHandler");
const rootRouter = require("./routes/index");
const db = require("./services/db");
require("dotenv").config();

/**
 * Create Express application
 */
const app = express();

/**
 * Secure HTTP response headers
 */
app.use(helmet());

/**
 * Allow Cross-Origin requests
 */
app.use(cors());

/**
 * Sanitizes user-supplied data to prevent MongoDB Operator Injection
 */
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);

/**
 * Add logger
 */
app.use(logger("dev"));

/**
 * View engine setup
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/**
 * Define static content
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Hook all routes
 */
app.use("/", rootRouter);

/**
 * Handle undefined routes
 */
app.use("*", (req, res, next) => {
  const err = createError(404);
  next(err, req, res, next);
});

/**
 * Connection to DB
 */
db.connect();

/**
 * Set global error handler
 */
app.use(globalErrorHandler);

module.exports = app;
