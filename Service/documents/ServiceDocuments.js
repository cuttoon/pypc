const { parseJSON } = require("jquery");
const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  getAllDocuments: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    console.log("data de All documents", data)
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_DOCUMENTS(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getDetail: async (data) => {
    console.log("data", data);

    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const result = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_DETAIL(:document_id, :cursor); END;`,
      data
    );
    const resultSet = result.cursor;
    console.log("resultSet", resultSet);
    const documents = resultSet.map((doc) => {
      console.log("doc", doc);
      const parsedDocument = JSON.parse(doc['JSON_OBJECT(\'DOCUMENT\'VALUEJSON_OBJECT']);
      return {
        ...parsedDocument,
        GEOSCOPE: parsedDocument.GEOSCOPE || [],
        INTERACTIONS: parsedDocument.INTERACTIONS || [],
        PHASES: parsedDocument.PHASES || [],
      };
    });

    return documents;
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
    console.log(data);
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
