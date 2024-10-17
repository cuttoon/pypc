const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createNews: async (data) => {
    try {
      console.log("data.ids", data.ids);
      data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };

      const result = await db.procedureExecute(
        `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INSERT_NEWS(
              :ids,
              :title,
              :content,
              :published,
              :picture
              ); END;`,
        data
      );

      console.log("Resultado de la inserción:", result);
      return result.ids;
    } catch (error) {
      console.log("Error en el service:", error);
      return res.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  createLetters: async (data) => {
    try {
      data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };

      const result = await db.procedureExecute(
        `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INSERT_LETTERS_NEWS(
              :ids,
              :title,
              :content,
              :published,
              :filepath
              ); END;`,
        data
      );

      console.log("Resultado de la inserción:", result);
      return result.ids;
    } catch (error) {
      throw new Error("Error al crear el createLetters");
    }
  },
  createExternalLink: async (data) => {
    try {
      data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };

      const result = await db.procedureExecute(
        `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INSERT_LINK(
              :ids,
              :title,
              :link
              ); END;`,
        data
      );

      console.log("Resultado de la inserción:", result);
      return result.ids;
    } catch (error) {
      throw new Error("Error al crear el createExternalLink");
    }
  }
};
