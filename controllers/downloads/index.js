"use strict";

const app = require("express")();
const path = require("path");

const FILE_DIR = path.join(__dirname, "files");

const download = (req, res) => {
  res.send(
    "<ul>" +
      '<li>Download <a href="/downloads/files/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
      '<li>Download <a href="/downloads/files/amazing.txt">amazing.txt</a>.</li>' +
      '<li>Download <a href="/downloads/files/missing.txt">missing.txt</a>.</li>' +
      '<li>Download <a href="/downloads/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>' +
      "</ul>"
  );
};

const files = (req, res, next) => {
  res.download(
    req.params.file,
    {
      root: FILE_DIR,
    },
    (err) => {
      if (!err) return// console.log("file sent");
      if (err.status !== 404) return next(err);
      // file not found for download
      res.statusCode = 404;
      res.send("can't find that file, sorry");
    }
  );
};

module.exports = {download,files}
