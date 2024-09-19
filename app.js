const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("./config/index");
const passport = require("passport");
const cors = require("cors");

mongoose.connect(config.MONGODB_URI).then(() => {
  console.log("connected MongoDB server");
});

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const categoryRouter = require("./routes/categoryRouter");
const cartRouter = require("./routes/cartRouter");

const pageRouter = require("./routes/pageRouter");
const { swaggerUi, swaggerSpec } = require("./lib/swagger");
// const abcRouter = require("./routes/abc");

var app = express();

// view engine setup
app.use(cors()); // ตั้งค่า CORS ให้อนุญาตจากทุกโดเมน (หรือระบุโดเมนเฉพาะตามต้องการ)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "node_modules/swagger-ui-dist")));
app.use(passport.initialize());

// routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/carts", cartRouter);
app.use("/page1", pageRouter);

module.exports = app;
