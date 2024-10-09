const oracledb = require('oracledb');
const db = require('../../Settings/Database/database');

module.exports = {
    getUserbyEmail: async(email) => {
        const user = await db.procedureExecuteCursor(`BEGIN PG_SPCI_CONSULTA.PA_SPCI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`, {
            sql_stmt: `
                SELECT 
                    u.NUSU_ID,
                    u.CUSU_EMAIL,
                    u.CUSU_PASSWORD,
                    u.NUSU_ISACTIVE,
                    u.NUSU_ISSUPERADMIN,
                    u.NUSU_ISSTAFF,
                    u.NUSU_ROLID,
                    u.CUSU_FIRSTNAME AS NAME,
                    r.CROLE_NAME AS ROL
                FROM 
                    SPCI_USERS u
                LEFT JOIN 
                    SPCI_ROLES r ON u.NUSU_ROLID = r.NROLE_ID
                WHERE 
                    u.CUSU_EMAIL='${email}'
            `,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });
        return user.cursor[0];
    }
}