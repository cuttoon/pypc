const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createTag: async (data) => {
    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        report_id: { type: oracledb.NUMBER },
        tag_id: { type: oracledb.NUMBER },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const tag = await db.manyExecute(
      `INSERT INTO SCAI_AUDITORIA_TAG(nata_tagid,nata_reportid) 
    VALUES (:tag_id,:report_id) RETURNING nata_id INTO :ids`,
      data,
      options
    );
    return tag;
  },
  deleteTag: async (ids) => {
    const result = await db.simpleExecute(
      `DELETE FROM SCAI_AUDITORIA_TAG WHERE nata_reportid= :ids `,
      [ids]
    );
    return result;
  },
  getTag: async (req) => {
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`,
      {
        sql_stmt: `SELECT ntag_id, ctag_name, ctag_normalized  AS DESCRIPTION FROM SCAI_TAG ORDER BY ntag_id `,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    return cursor.cursor;
  },

  newTag: async (data) => {
    var element = [];
    element.push({
      nombre: data.nombre,
      normalizado: data.normalizado,
    });

    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        nombre: { type: oracledb.STRING, maxSize: 255 },
        normalizado: { type: oracledb.STRING, maxSize: 255 },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const tag = await db.manyExecute(
      `INSERT INTO SCAI_TAG(ctag_name, ctag_normalized)
     VALUES (:nombre,:normalizado) RETURNING ntag_id INTO :ids `,
      element,
      options
    );

    return tag;
  },
};
