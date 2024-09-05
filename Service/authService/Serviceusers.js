const oracledb = require('oracledb');
const db = require('../../Settings/Database/database');

module.exports = {
    getAllUsers: async() => {
        const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }};
        const users = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_USUARIOS(:cursor); END;`, data);
        return users.cursor;
    },
    existEmail: async(email) => {
        const user = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`, {
            sql_stmt: `SELECT CUSU_EMAIL FROM SCAI_USUARIOS WHERE CUSU_EMAIL='${email}'`,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });
        return user.cursor[0];
    },
    existEmailUpdate: async(email,ids) => {
        const user = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`, {
            sql_stmt: `SELECT CUSU_EMAIL FROM SCAI_USUARIOS WHERE CUSU_EMAIL='${email}' AND NUSU_ID!='${ids}'`,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });
        return user.cursor[0];
    },
    createUser: async(data) => {
        data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
        const newEvent = await db.procedureExecute(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_USUARIO(
            :apellido,
            :correo,
            :sexo,
            :ids,
            :nombre,
            :pais
            ); END;`, data); 
        return newEvent.ids;    
    },
    updateUser: async(data) => {
        data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_INOUT ,val:data.ids};
        const newEvent = await db.procedureExecute(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_UPDATE_USUARIO(
            :apellido,
            :sexo,
            :ids,
            :nombre,
            :pais,
            :rol); END;`, data); 
        return newEvent.ids;    
    }
}