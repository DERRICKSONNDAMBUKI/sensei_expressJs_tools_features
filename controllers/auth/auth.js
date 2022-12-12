const hash = require("pbkdf2-password")();
const path = require("path");
const express = require("express");
const session = require("express-session");

const app = express();

// config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session untill something stored
    secret: "shhhh, very secret",
  })
);

// session-persistent message middleware
app.use((req, res, next) => {
  const err = req.session.error;
  const msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = "";
  if (err) res.locals.message = '<p class="msg error">' + err + "</p>";
  if (msg) res.locals.message = '<p class="msg success">' + msg + "</p>";
  next();
});

// dummy database
const users = {
  admin: { name: "admin" },
};

// when you craete a user, generate a salt
// and hash the password ('pass' is the password here)
hash({ password: "pass" }, (err, pass, salt, hash) => {
  if (err) throw err;
  // store the salt & hash in the "db"
  users.admin.salt = salt;
  users.admin.hash = hash;
});


const auth = (req, res) => {
  res.send("This is Auth!");
};

module.exports = auth;
