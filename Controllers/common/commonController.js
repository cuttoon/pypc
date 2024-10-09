const userdb   = require('../../Service/common/ServiceCommon')

module.exports = {
  getAllSAI: async(req, res, next) => {
    try {
      const sai = await userdb.getAllSAI();
      res.send({ result: sai })
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getAllCategory: async(req, res, next) => {
    try {
      const category = await userdb.getAllCategory();
      res.send({ result: category })
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getAllModels: async(req, res, next) => {
    try {
      const models = await userdb.getAllModels();
      res.send({ result: models })
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getAllGeoscope: async(req, res, next) => {
    try {
      const geo = await userdb.getAllGeoscope();
      res.send({ result: geo })
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getAllInteractions: async(req, res, next) => {
    try {
      const int = await userdb.getAllInteractions();
      res.send({ result: int })
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  getAllPhase: async(req, res, next) => {
    try {
      const phase = await userdb.getAllPhase();
      res.send({ result: phase })
    } catch (error) {
      res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
}