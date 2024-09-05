const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  getAllUsers: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const users = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_USUARIOS(:cursor); END;`,
      data
    );
    return users.cursor;
  },
  existEmail: async (email) => {
    const user = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`,
      {
        sql_stmt: `SELECT CUSU_EMAIL FROM SCAI_USUARIOS WHERE CUSU_EMAIL='${email}'`,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );
    return user.cursor[0];
  },
  existEmailUpdate: async (email, ids) => {
    const user = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`,
      {
        sql_stmt: `SELECT CUSU_EMAIL FROM SCAI_USUARIOS WHERE CUSU_EMAIL='${email}' AND NUSU_ID!='${ids}'`,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );
    return user.cursor[0];
  },
  createUser: async (data) => {
    data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
    const newEvent = await db.procedureExecute(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_USUARIO(
            :apellido,
            :correo,
            :sexo,
            :ids,
            :nombre,
            :pais
            ); END;`,
      data
    );
    return newEvent.ids;
  },
  updateUser: async (data) => {
    try {
      const bindings = {
        apellido: { val: data.apellido, type: oracledb.STRING },
        sexo: { val: data.sexo, type: oracledb.STRING },
        ids: { dir: oracledb.BIND_INOUT, val: data.ids, type: oracledb.NUMBER },
        nombre: { val: data.nombre, type: oracledb.STRING },
        pais: { val: data.pais, type: oracledb.NUMBER },
        rol: { val: data.rol, type: oracledb.NUMBER },
      };

      await db.procedureExecute(
        `
                BEGIN 
                    PG_SCAI_CONSULTA.PA_SCAI_UPDATE_USUARIO(
                        :apellido,
                        :sexo,
                        :ids,
                        :nombre,
                        :pais,
                        :rol
                    ); 
                END;`,
        bindings,
        {
          autoCommit: true,
        }
      );

      const userId = bindings.ids.val;

      const userResult = await db.simpleExecute(
        `
            SELECT cusu_email
            FROM scai_usuarios
            WHERE nusu_id = :id
        `,
        { id: userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const userEmail = userResult.rows.length
        ? userResult.rows[0].CUSU_EMAIL
        : null;

      if (!userEmail) {
        throw new Error("No se pudo encontrar el correo del usuario.");
      }

      return { userId, userEmail };
    } catch (err) {
      console.error("Error al ejecutar el procedimiento", err);
      throw new Error(err.message);
    }
  },
};
