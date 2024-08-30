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

      const userId =  result.outBinds.p_user_id;

      if (!userId) {
        return { error: 'User not found or email not registered.' };
      }

      console.log(typeof resetLink)
      if (typeof resetLink !== 'string') {
        throw new Error('resetLink must be a string.');
      }

      await db.simpleExecute(
        `
        BEGIN
            PG_SCAI_UTILIDAD.PA_PER_ENVIAEMAIL_HTML(
                '127.0.0.1', // pServidor
                :p_to, // p_to
                'no-reply@example.com', // p_from
                'Password Reset Request', // p_subject
                'Click the following link to reset your password: ' || :p_reset_link, // p_text
                '<p>Click <a href="' || :p_reset_link || '">here</a> to reset your password.</p>' // p_html
            );
        END;`,
        {
          p_to: email,
          p_reset_link: resetLink // Usa el valor pasado desde el controlador
        }
      );

      return { success: 'Password reset email sent successfully.' };
    } catch (err) {
      console.error('Error in forgotPass:', err); // Agregar depuración
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
