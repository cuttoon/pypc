const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  forgotPass: async (email) => {
    try {
      const result = await db.simpleExecute(
        `
        BEGIN
            PG_SCAI_CONSULTA.PA_SCAI_FORGOT_PASSWORD(:p_email, :p_user_id);
        END;`,
        {
          p_email: email,
          p_user_id: {
              dir: oracledb.BIND_OUT,
              type: oracledb.NUMBER
          }
      }
      );
      // return result.outBinds.p_token; // Devuelve el token

      return result.outBinds.p_user_id;
    } catch (err) {
      return { error: err.message };
    }
  },
  resetPass: async (userId, hashedPassword) => {
    try {
      // Llamada al procedimiento almacenado para resetear la contraseña
      const result = await db.procedureExecute(
        `
            BEGIN 
                PG_SCAI_CONSULTA.PA_SCAI_RESET_PASSWORD(:p_user_id, :p_new_pass);
            END;`,
        { p_user_id: userId, p_new_pass: hashedPassword }
      );
      return result;
    } catch (err) {
      return { error: err.message };
    }
  },
};
