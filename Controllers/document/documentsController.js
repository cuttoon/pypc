const userdb = require("../../Service/documents/ServiceDocuments");
const { validateDocuments } = require('../../Models');
const moment = require("moment");
const CustomError = require("../../Service/errors");

module.exports = {
  getAllDocuments: async (req, res, next) => {
    try {
      const document = await userdb.getAllDocuments();
      res.send({ result: document });
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getDetail: async (req, res, next) => {
    try {
      const document = await userdb.getDetail(req.body);
      res.send({ result: document });
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getSimpleSearch: async (req, res, next) => {
    try {
      const document = await userdb.getSimpleSearch(req.body);
      res.send({ result: document });
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  postAdvanceSearch: async (req, res, next) => {
    try {
      const document = await userdb.postAdvanceSearch(req.body);
      res.send({ result: document });
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  postModelGraph: async (req, resp, next) => {
    try {
      const document = await userdb.postModelGraph(req.body);
      resp.send({ result: document });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  postInteractionGraph: async (req, resp, next) => {
    try {
      console.log(req.body);
      const document = await userdb.postInteractionGraph(req.body);
      resp.send({ result: document });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  postPhaseGraph: async (req, resp, next) => {
    try {
      const document = await userdb.postPhaseGraph(req.body);
      resp.send({ result: document });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },

  postGeoscopeGraph: async (req, resp, next) => {
    try {
      const document = await userdb.postGeoscopeGraph(req.body);
      resp.send({ result: document });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createDocuments: async (req, res, next) => {
    try {
      console.log("recibiendo datos: ", req.body);

      req.body.categoryid = parseInt(req.body.categoryid);
      req.body.modelid = parseInt(req.body.modelid);
      req.body.countryid = parseInt(req.body.countryid);
      req.body.userid = parseInt(req.body.userid);

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);

      req.body.fini = moment(req.body.fini, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.fini, "DD-MM-YYYY").toDate()
        : null;
      req.body.ffin = moment(req.body.ffin, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.ffin, "DD-MM-YYYY").toDate()
        : null;

      validateDocuments(req.body);

      const dataEvent = Object.assign({}, req.body);
      console.log("dataEvent", dataEvent);
      let result = null;
      if (req.body.ids == 0) {
        result = await userdb.createDocument(dataEvent);
      } else {
        console.log("se actualizara el documento")
      }

      res.send({ result });
    } catch (error) {
      console.log("Error al crear la auditoria", error.message);
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  createClasification: async (req, res, next) => {
    try {
      const clasification = await userdb.createClasification(req.body);
      res.send({result: clasification})
    } catch (error) {
      console.log(error);
      return res.status(500).send({ statusCode: 500, message: error.message });
    }
  }
};
