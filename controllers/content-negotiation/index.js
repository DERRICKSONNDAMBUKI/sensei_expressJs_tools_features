"use strict";

const express = require("express");
const app = express;
const users = require("./db");

const content_negotiation = (req, res) => {
  res.format({
    html: () => {
      res.send(
        "<ul>" +
          users
            .map((user) => {
              return "<li>" + user.name + "</li>";
            })
            .join("") +
          "</ul>"
      );
    },
    text: () => {
      res.send(
        users
          .map((user) => {
            return "-" + user.name + "\n";
          })
          .join("")
      );
    },
    json: () => {
      res.json(users);
    },
  });
};

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:
const format = (path) => {
  const obj = require(path);
  return (req, res) => {
    res.format(obj);
  };
};

module.exports = { content_negotiation, format };