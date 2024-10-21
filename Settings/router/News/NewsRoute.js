const express = require("express");
const router = express.Router();
const { News } = require("../../../Controllers");
const { Filter } = require("../../Server/middleware/permissions");
const { checkPictures } = require("../../Media/media");

router.post('/createNews', Filter, checkPictures, News.createNews);
// router.post('/createLetters', Filter, checkreports, News.createLetters);

module.exports = (app, nextMain) => {
  app.use('/pypc/news', router);
  return nextMain();
};
