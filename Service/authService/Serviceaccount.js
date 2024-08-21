const oracledb = require('oracledb');
const db = require('../../Settings/Database/database');

module.exports = {
    getUserbyEmail: async(email) => {
        const user = await db.procedureExecuteCursor(`BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`, {
            sql_stmt: `SELECT NUSU_ID,CUSU_EMAIL,CUSU_PASSWORD,NUSU_ISACTIVE,NUSU_ISSUPERADMIN,NUSU_ISSTAFF,NUSU_ROLID, CUSU_FIRSTNAME AS NOMBRE FROM SCAI_USUARIOS WHERE CUSU_EMAIL='${email}'`,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });
        return user.cursor[0];
    }
}