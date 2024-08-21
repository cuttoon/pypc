const oracledb = require('oracledb');
const db = require('../../Settings/Database/database');



module.exports = {
    getallCategoria: async() => {
        const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }};
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_TEMAS(:cursor); END;`, data);
        return cursor.cursor;
    },
    getallTipoAuditoria: async() => {
        const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }};
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_TIPO_TEMAS(:cursor); END;`, data);
        return cursor.cursor;
    },
    getallODS: async() => {
        const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }};
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_ODS(:cursor); END;`, data);
        return cursor.cursor;
    },

    getallAmbito:async() => {
        const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }};
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_AMBITO(:cursor); END;`, data);
        return cursor.cursor;
    },
    getallPais:async() => {
        const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }};
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_PAIS(:cursor); END;`, data);
        return cursor.cursor;
    },
    getallParametro:async(req) => {
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`, {
            sql_stmt: `SELECT ntro_code ntro_id, ctro_valuename  AS DESCRIPTION FROM SCAI_PARAMETRO WHERE ctro_tablename ='${req.params.table_name}' ORDER BY ntro_code `,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });

        return cursor.cursor;
    },
    getallIdiomas:async(req) => {
        const cursor = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`, {
            sql_stmt: `SELECT  nidi_id, cidi_languagename  AS DESCRIPTION FROM SCAI_IDIOMA  ORDER BY nidi_id `,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });

        return cursor.cursor;
    },   
    
}

