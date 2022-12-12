var express = require("express");
var router = express.Router();

// controllers
const auth = require("../controllers/auth/auth");


/* GET auth page. */
router.get("/", auth);

module.exports = router;
