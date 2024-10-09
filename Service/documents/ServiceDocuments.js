const { parseJSON } = require("jquery");
const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  getAllDocuments: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_DOCUMENTS(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getDetail: async (data) => {
    console.log("data", data);
    data.c_document = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.c_pdfs = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.c_interactions = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.c_phases = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.c_geoscopes = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const events = await db.procedureExecuteCursorsArray(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_DETAIL(:document_id, :c_document, :c_pdfs, :c_interactions, :c_phases, :c_geoscopes); END;`,
      data
    );
    return {
      document: events.c_document,
      pdfs: events.c_pdfs,
      interactions: events.c_interactions,
      phases: result.c_phases,
      geoscopes: events.c_geoscopes,
    };
  },
  getSimpleSearch: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const result = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_SIMPLE_SEARCH(:search,:cursor); END;`,
      data
    );

    const resultSet = result.cursor;

    const documents = resultSet.map((doc) => ({
      ...doc,
      GEOSCOPE: JSON.parse(doc.GEOSCOPE),
      INTERACTIONS: JSON.parse(doc.INTERACTIONS),
      PHASES: JSON.parse(doc.PHASES),
    }));

    return documents;
  },
  getAdvanceSearch: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_ADVANCE_SEARCH(:category,:model,:sai,:geoscope,:interaction,:phase,:scope_start,:scope_end,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  postModelGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_MODEL_GRAPH(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  postInteractionGraph: async (data) => {
    console.log(data)
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INTERACTION_GRAPH(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  postPhaseGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_PHASE_GRAPH(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
};