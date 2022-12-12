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
  // if (err) console.error(err);
  // store the salt & hash in the "db"
  users.admin.salt = salt;
  users.admin.hash = hash;
});

// authenticate using our plain-object database of doom!
const authenticate = (name, pass, fn) => {
  if (!module.parent) console.log("authenticating %s %s", name, pass);
  const user = users[name];

  // querry the db for the given username
  if (!user) return fn(null, null);

  // apply the same algo to the POSTed password,
  // applying the hash against the pass / salt, if there is a match we found user
  hash({ password: pass, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) return fn(err);
    if (hash === user.hash) fn(null, null);
  });
};

const restrict = (res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.session.error = "Access denied!";
    res.redirect("/login");
  }
};

// route functions
const auth = (req, res) => {
  // res.send("This is Auth!");
  res.redirect("/login");
};

const restricted = (req, res) => {
  res.send(
    'Wooha! suucessfull accessed restricted area, click to <a href="/logout">Logout</a>'
  );
};

const login = (req, res) => {
  res.render("login");
};

const logout = (req, res) => {
  // destroy the user's session to log them out
  // will be re-created next on request
  req.session.destroy(() => {
    res.redirect("/");
  });
};

const loginFunction = (req, res, next) => {
  authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) return next(err);
    if (user) {
      // regenerate session when signing in to prevent fixation
      req.session.regenerate(() => {
        // store the user's primary key in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success =
          "Authenticated as " +
          user.name +
          ' click to <a href="/logout">Logout</a>. ' +
          ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect("back");
      });
    } else {
      req.session.error =
        "Authentication failed, please check your " +
        " username and password." +
        ' (use "admin" and "pass"';
      res.redirect("/login");
    }
  });
};

(module.exports = auth), restrict;
