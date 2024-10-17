const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createGeoscope: async (data) => {
    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        doc_id: { type: oracledb.NUMBER },
        geo_id: { type: oracledb.NUMBER },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const geo = await db.manyExecute(
      `INSERT INTO SPCI_DOC_GEOSCOPE(ndge_docid, ndge_geoid) 
        VALUES (:doc_id,:geo_id) RETURNING ndge_id INTO :ids`,
      data,
      options
    );
    return geo;
  },
  createInteraction: async (data) => {
    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        doc_id: { type: oracledb.NUMBER },
        int_id: { type: oracledb.NUMBER },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const int = await db.manyExecute(
      `INSERT INTO SPCI_DOC_INTERACTION(ndin_docid, ndin_intid) 
        VALUES (:doc_id,:int_id) RETURNING ndin_id INTO :ids`,
      data,
      options
    );
    return int;
  },
  createPhases: async (data) => {
    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        doc_id: { type: oracledb.NUMBER },
        pha_id: { type: oracledb.NUMBER },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const pha = await db.manyExecute(
      `INSERT INTO SPCI_DOC_PHASE(ndph_docid, ndph_phaseid) 
        VALUES (:doc_id,:pha_id) RETURNING ndph_id INTO :ids`,
      data,
      options
    );
    return pha;
  },
}