const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  getAllUsers: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const users = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_USERS(:cursor); END;`,
      data
    );
    return users.cursor;
  },
  existEmail: async (email) => {
    const user = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`,
      {
        sql_stmt: `SELECT CUSU_EMAIL FROM SPCI_USERS WHERE CUSU_EMAIL='${email}'`,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );
    return user.cursor[0];
  },
  existEmailUpdate: async (email, ids) => {
    const user = await db.procedureExecuteCursor(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`,
      {
        sql_stmt: `SELECT CUSU_EMAIL FROM SPCI_USERS WHERE CUSU_EMAIL='${email}' AND NUSU_ID!='${ids}'`,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );
    return user.cursor[0];
  },
  createUser: async (data) => {
    data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
    const newEvent = await db.procedureExecute(
      `BEGIN PG_SPCI_CONSULTA.PA_SPCI_INSERT_USERS(
            :lastname,
            :email,
            :gender,
            :ids,
            :name,
            :country
            ); END;`,
      data
    );
    return newEvent.ids;
  },
  updateUser: async (data) => {
    try {
      const bindings = {
        lastname: { val: data.lastname, type: oracledb.STRING },
        gender: { val: data.gender, type: oracledb.STRING },
        ids: { dir: oracledb.BIND_INOUT, val: data.ids, type: oracledb.NUMBER },
        name: { val: data.name, type: oracledb.STRING },
        country: { val: data.country, type: oracledb.NUMBER },
        rol: { val: data.rol, type: oracledb.NUMBER },
      };

      await db.procedureExecute(
        `
                  BEGIN 
                      PG_SPCI_CONSULTA.PA_SPCI_UPDATE_USERS(
                          :lastname,
                          :gender,
                          :ids,
                          :name,
                          :country,
                          :rol
                      ); 
                  END;`,
        bindings,
        {
          autoCommit: true,
        }
      );
      const userId = bindings.ids.val;

      return { userId };
    } catch (err) {
      console.error("Error al ejecutar el procedimiento", err);
      throw new Error(err.message);
    }
  },
};