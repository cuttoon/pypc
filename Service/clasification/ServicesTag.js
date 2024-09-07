const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

module.exports = {
  createTag: async (data) => {
    const results = [];
  
    for (let i = 0; i < data.length; i++) {
      const currentTag = data[i];
  
      if (!currentTag.nombre || currentTag.nombre.trim() === "") {
        throw new Error("El nombre del tag no puede estar vacío");
      }
  
      // Normalizar el nombre del tag a mayúsculas
      const normalizado = currentTag.nombre.toUpperCase();
  
      // Crear el tag en SCAI_TAG y obtener el ID generado por el trigger
      const element = {
        nombre: currentTag.nombre,
        normalizado: normalizado,
      };
  
      const options = {
        autoCommit: true,
        bindDefs: {
          nombre: { type: oracledb.STRING, maxSize: 255 },
          normalizado: { type: oracledb.STRING, maxSize: 255 },
        },
      };
  
      
      const result = await db.simpleExecute(
        `INSERT INTO SCAI_TAG(ctag_name, ctag_normalized)
          VALUES (:nombre, :normalizado)
          RETURNING ntag_id INTO :tag_id`, // Capturamos el ID generado por el trigger
        { ...element, tag_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
        options
      );
  
      const tagId = result.outBinds.tag_id[0]; // El ID generado
  
      
      await db.simpleExecute(
        `INSERT INTO SCAI_AUDITORIA_TAG(nata_reportid, nata_tagid)
          VALUES (:report_id, :tag_id)`,
        {
          tag_id: tagId,
          report_id: currentTag.report_id,
        },
        { autoCommit: true }
      );
  
      results.push({
        message: "Tag creado y relacionado correctamente",
        tag_id: tagId,
      });
    }
  
    return results; 
  },
  
  newTag: async (data) => {
    const normalizado = data.nombre.toUpperCase();
    const element = [
      {
        nombre: data.nombre, 
        normalizado: normalizado, 
      },
    ];

    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        nombre: { type: oracledb.STRING, maxSize: 255 },
        normalizado: { type: oracledb.STRING, maxSize: 255 },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const tag = await db.manyExecute(
      `INSERT INTO SCAI_TAG(ctag_name, ctag_normalized)
     VALUES (:nombre,:normalizado) RETURNING ntag_id INTO :ids `,
      element,
      options
    );

    console.log(tag);
    return tag;
  },
};
