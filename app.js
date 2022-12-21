const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// route paths
const indexRouter = require("./routes/home/index");
const usersRouter = require("./routes/users/users");
const authRouter = require("./routes/auth/auth");
const contentNegotiationRouter = require("./routes/content-negotiation/cn_route");
const downloadsRouter = require("./routes/downloads/downloads");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter); // ricky has bugs
// HTTP content negotiator
app.use("/contentnegotiation", contentNegotiationRouter);
// transferring files to client
app.use("/downloads", downloadsRouter); // ricky has bugs

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
