const {
  validateNews,
  validateLettersNews,
  validateLink,
} = require("../../Models");
const userdb = require("../../Service/news/ServiceNews");
const moment = require("moment");

module.exports = {
  createNews: async (req, res, next) => {
    try {
      console.log("recibiendo datos: ", req.body);
      console.log("req.files", req.files);

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);

      console.log(
        "req.body.published",
        moment(req.body.published, "DD-MM-YYYY", true)
      );
      req.body.published = moment(
        req.body.published,
        "DD-MM-YYYY",
        true
      ).toDate();

      validateNews(req.body);

      const dataEvent = Object.assign({}, req.body);
      let result = null;
      if (req.body.ids == 0) {
        result = await userdb.createNews(dataEvent);
      } else {
        console.log("Se actualizara el apartado de News");
      }
      res.send({ result });
    } catch (error) {
      console.error("Error en el controlador:", error);
      return res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  createLetters: async (req, res, next) => {
    try {
      console.log("recibiendo datos: ", req.body);
      console.log("req.files", req.files);

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);

      console.log(
        "req.body.published",
        moment(req.body.published, "DD-MM-YYYY", true)
      );
      req.body.published = moment(
        req.body.published,
        "DD-MM-YYYY",
        true
      ).toDate();

      req.body.filepath = req.body.filepath.toString();

      validateLettersNews(req.body);

      const dataEvent = Object.assign({}, req.body);
      let result = null;
      if (req.body.ids == 0) {
        result = await userdb.createLetters(dataEvent);
      } else {
        console.log("Se actualizara el apartado de News");
      }
      res.send({ result });
    } catch (error) {
      console.error("Error en el controlador:", error);
      return res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  createExternalLink: async (req, res, next) => {
    try {

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);

      validateLink(req.body);
      const dataEvent = Object.assign({}, req.body);
      console.log("Datos enviados a la base de datos:", dataEvent);

      let result = null;
      if (req.body.ids == 0) {
        result = await userdb.createExternalLink(dataEvent);
      }
      res.send({ result });
    } catch (error) {
      console.error("Error en createExternalLink - controller:", error);
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
};
