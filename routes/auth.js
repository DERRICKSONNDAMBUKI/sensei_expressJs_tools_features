var express = require("express");
var router = express.Router();

// controllers
const {auth, restrict, restricted, login, logout, loginFunction} = require("../controllers/auth/auth");


/* GET auth page. */
router.get("/", auth);
router.get('/restricted',restrict,restricted)
router.get('/login',login)
router.get('/logout',logout)
router.post('/login',loginFunction)


module.exports = router;