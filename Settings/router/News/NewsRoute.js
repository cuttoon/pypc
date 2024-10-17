const express = require("express");
const router = express.Router();
const { News } = require("../../../Controllers");
const { Filter } = require("../../Server/middleware/permissions");
const { checkFiles } = require("../../Media/media");

router.post("/createNews", Filter, checkFiles, News.createNews);

module.exports = (app, nextMain) => {
  console.log("Rutas de noticias cargadas");
  app.use("/pypc/news", router);
  return nextMain();
};
