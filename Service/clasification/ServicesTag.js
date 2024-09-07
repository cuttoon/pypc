const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createTag: async (tagId, reportId) => {
    await db.simpleExecute(
      `INSERT INTO SCAI_AUDITORIA_TAG(nata_reportid, nata_tagid)
        VALUES (:report_id, :tag_id)`,
      {
        tag_id: tagId,
        report_id: reportId,
      },
      { autoCommit: true }
    );

    return {
      message: "Tag relacionado con el reporte correctamente",
      tag_id: tagId,
      report_id: reportId,
    };
  },

  newTag: async (data) => {
    const normalizado = data.nombre.toUpperCase(); 
    const element = {
      nombre: data.nombre,
      normalizado: normalizado,
    };

    const options = {
      autoCommit: true,
      bindDefs: {
        nombre: { type: oracledb.STRING, maxSize: 255 },
        normalizado: { type: oracledb.STRING, maxSize: 255 },
      },
    };


    const result = await db.simpleExecute(
      `INSERT INTO SCAI_TAG(ctag_name, ctag_normalized)
        VALUES (:nombre, :normalizado)
        RETURNING ntag_id INTO :ids`, 
      {
        ...element,
        ids: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      options
    );

    const tagId = result.outBinds.ids;

    if (!tagId) {
      throw new Error("No se pudo generar el ID del nuevo tag.");
    }

    return tagId;
  },
};
