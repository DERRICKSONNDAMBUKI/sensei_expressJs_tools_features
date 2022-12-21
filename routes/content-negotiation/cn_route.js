const route = require("express").Router();

// controllers
const {
  content_negotiation,
  format,
} = require("../../controllers/content-negotiation");

route.get("/", content_negotiation);
route.get("/users", format("../../controllers/content-negotiation/users.js"));

module.exports=route