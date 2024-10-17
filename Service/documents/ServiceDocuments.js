const { parseJSON, data } = require("jquery");
const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");
const { createGeoscope, createInteraction, createPhases } = require("../clasification/ServiceClasification");

const parseGeoscope = (data, geo) => {
  return data.map((ele) => {
    ele.doc_id = geo;
    ele.geo_id = ele.geo_id ? parseInt(ele.geo_id) : ele.geo_id;
    return ele;
  });
};

const parseInteraction = (data, int) => {
  return data.map((ele) => {
    ele.doc_id = int;
    ele.int_id = ele.int_id ? parseInt(ele.int_id) : ele.int_id;
  });
};

const parsePhase = (data, pha) => {
  return data.map((ele) => {
    ele.doc_id = pha;
    ele.pha_id = ele.pha_id ? parseInt(ele.pha_id) : ele.pha_id;
  });
};


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
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const result = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_DETAIL(:document_id, :cursor); END;`,
      data
    );

    const resultSet = result.cursor;

    const documents = resultSet.map((doc) => {
      const jsonDocument = JSON.parse(
        doc[
          "JSON_OBJECT('DOCUMENT'VALUEJSON_OBJECT('ID_DOC'VALUED.NDOC_ID,'TITLE'VALUED.CDOC_TITLE,'SUMMARY'VALUED.CDOC_SUMMARY,'ID_CATEGORY'VALUED.NDOC_IDCATEGORY,'CATEGORY'VALUEC.CCAT_CATNAME,'ID_MODEL'VALUED.NDOC_IDMODEL,'MODEL'VALUEM.CMOD_NAME,'ID_COUNTRY'VAL"
        ]
      );

      return {
        ...jsonDocument,
        PDFS: jsonDocument.PDFS,
        GEOSCOPE: jsonDocument.GEOSCOPE,
        INTERACTION: jsonDocument.INTERACTION,
        PHASES: jsonDocument.PHASES,
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
  postAdvanceSearch: async (data) => {
    const bindVars = {
      category: data.category || null,
      model: data.model || null,
      country: data.country || null,
      geoscope: data.geoscope || null,
      interaction: data.interaction || null,
      phase: data.phase || null,
      scope_start: data.scope_start || null,
      scope_end: data.scope_end || null,
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_ADVANCE_SEARCH(
          :category, :model, :country, :geoscope, :interaction, :phase, 
          :scope_start, :scope_end, :cursor); 
       END;`,
      bindVars
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
  postGeoscopeGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_GEOSCOPE_GRAPH(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  createDocument: async (data) => {
    data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
    data.material = data.material ? data.material : null;
    data.link = { val: data.link ? data.link : null };
    const newEvent = await db.procedureExecute(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INSERT_DOCUMENTS(
            :title,
            :summary,
            :categoryid,
            :modelid,
            :countryid,
            :fini,
            :ffin,
            :link,
            :userid,
            :material,
            :ids            
            ); END;`,
      data
    );
    return newEvent.ids;
  },
  createClasification: async (data) => {
    const geo_ = await createGeoscope(parseGeoscope(data.geo, data.doc_id));
    const int_ = await createInteraction(parseInteraction(data.int, data.doc_id));
    const pha_ = await createPhases(parsePhase(data.pha, data.doc_id));

    return {
      geoscope: geo_,
      interaction: int_,
      phases: pha_
    }
  }
};
