const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  getAllSAI: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_SAI(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getAllCategory: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_CATEGORY(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getAllModels: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_MODELS(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getAllGeoscope: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_GEOSCOPE(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getAllInteractions: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INTERACTION(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getAllPhase: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_PHASE(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
};