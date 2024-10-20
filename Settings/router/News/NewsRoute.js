const express = require("express");
const router = express.Router();
const { News } = require("../../../Controllers");
const { Filter } = require("../../Server/middleware/permissions");
const { checkPictures } = require("../../Media/media");

router.post('/createNews', checkPictures, News.createNews);

module.exports = (app, nextMain) => {
  app.use('/pypc/news', router);
  return nextMain();
};
