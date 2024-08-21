const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createOds: async (data) => {
    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        report_id: { type: oracledb.NUMBER },
        ods_id: { type: oracledb.NUMBER },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const ods = await db.manyExecute(
      `INSERT INTO SCAI_AUDITORIA_ODS(naod_odsid,naod_reportid) 
        VALUES (:ods_id,:report_id) RETURNING naod_id INTO :ids`,
      data,
      options
    );
    return ods;
  },
  deleteOds: async (ids) => {
    const result = await db.simpleExecute(
      `DELETE FROM SCAI_AUDITORIA_ODS WHERE naod_reportid= :ids `,
      [ids]
    );
    return result;
  },
};
