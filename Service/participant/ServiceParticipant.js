const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createParticipante: async (data) => {
    const options = {
      autoCommit: true,
    };

    let results = [];

    if (Array.isArray(data) && data.length > 0) {
      for (const participante of data) {
        const insertData = {
          report_id: participante.report_id,
          ambito_id: participante.ambito_id,
          pais_id: participante.pais_id,
          entidad: participante.entidad || null,
          otro_id: participante.otro_id || null,
          rol_id: participante.rol_id || null,
          tipo_id: participante.tipo_id || null,
        };

        try {
          const participanteResult = await db.simpleExecute(
            `
                  INSERT INTO SCAI_PARTICIPANTE(
                    nnte_reportid, 
                    nnte_ambitoid, 
                    nnte_paisid, 
                    cnte_entidad, 
                    nnte_otroid, 
                    nnte_rolid, 
                    nnte_tipoentidadid
                  ) 
                  VALUES (:report_id, :ambito_id, :pais_id, :entidad, :otro_id, :rol_id, :tipo_id) 
                  RETURNING nnte_id INTO :id
                `,
            {
              ...insertData,
              id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            },
            options
          );

          if (
            participanteResult &&
            participanteResult.outBinds &&
            participanteResult.outBinds.id
          ) {
            console.log(
              `Participante insertado con ID: ${participanteResult.outBinds.id[0]}`
            );
            results.push({
              ...participante,
              id: participanteResult.outBinds.id[0],
            });
          } else {
            results.push(null);
          }
        } catch (error) {
          console.error(
            `Error insertando participante con pais_id ${participante.pais_id}:`,
            error
          );
          throw error;
        }
      }
    } else {
      console.error("No se encontraron participantes en la solicitud.");
    }

    return results;
  },
  deleteParticipante: async (ids) => {
    const result = await db.simpleExecute(
      `DELETE FROM SCAI_PARTICIPANTE WHERE nnte_reportid= :ids `,
      [ids]
    );
    return result;
  },
};
