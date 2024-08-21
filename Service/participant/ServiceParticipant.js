const oracledb = require('oracledb');
const db = require('../../Settings/Database/database');

module.exports = {
    createParticipante: async(data) => {
        const options = {
            autoCommit: true,
            batchErrors: true,
            bindDefs: {
                report_id: { type: oracledb.NUMBER },
                ambito_id: { type: oracledb.NUMBER },              
                pais_id: { type: oracledb.NUMBER },              
                entidad: { type: oracledb.STRING ,maxSize:150},
                otro_id: { type: oracledb.NUMBER },              
                rol_id: { type: oracledb.NUMBER },              
                tipo_id: { type: oracledb.NUMBER },              
                ids: { type: oracledb.NUMBER , dir: oracledb.BIND_OUT}
            }

                
            
        };
        const participante = await db.manyExecute(`INSERT INTO SCAI_PARTICIPANTE(nnte_reportid, nnte_ambitoid, nnte_paisid, cnte_entidad, nnte_otroid, nnte_rolid, nnte_tipoentidadid) 
        VALUES (:nnte_reportid,:nnte_ambitoid,:nnte_paisid,:cnte_entidad,:nnte_otroid,:nnte_rolid, :nnte_tipoentidadid) RETURNING nnte_id INTO :ids`, data, options);
        return participante;
    },
    deleteParticipante: async(ids) => {
        const result = await db.simpleExecute(`DELETE FROM SCAI_PARTICIPANTE WHERE nnte_reportid= :ids `, [ids]);        
        return result;
    }
    ,
};

        