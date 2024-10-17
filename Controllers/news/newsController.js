const userdb = require("../../Service/news/ServiceNews");

module.exports = {
  createNews: async (req, res, next) => {
    try {
      console.log("recibiendo datos: ", req.body);
      console.log("req.files", req.files)

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);

      console.log("req.body.published", moment(req.body.published, 'DD-MM-YYYY', true));
      req.body.published = moment(req.body.published, 'DD-MM-YYYY', true).toDate();

      const news = await userdb.createNews(req.body);
      res.send({result: news})
    } catch (error) {
      console.error("Error en el controlador:", error);
      return res.status(500).send({ statusCode: 500, message: error.message });
    }
  }
}
