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
            type: oracledb.NUMBER,
          },
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
  sendEmail: async (email, subject, text, html) => {
    try {
      await db.simpleExecute(
        `
        BEGIN
            PG_SCAI_UTILIDAD.PA_SCAI_ENVIAEMAIL_HTML(
                'localhost',
                :p_to,
                'no-reply@example.com',
                :p_subject,
                :p_text,
                :p_html
            );
        END;`,
        {
          p_to: email,
          p_subject: subject,
          p_text: text,
          p_html: html
        }
      );
      return { success: "Email sent successfully." };
    } catch (err) {
      console.error("Error in sendEmail:", err);
      return { error: err.message };
    }
  },
};
