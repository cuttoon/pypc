const oracledb = require('oracledb');
const dbConfig = require('../../Settings/Environment/config');
const { extractCursors } = require('./extractCursors');
var SimpleOracleDB = require('simple-oracledb');

const initialize = async() => {
    try {
        await oracledb.createPool(dbConfig.eventsPool);

    } catch (error) {
        console.log(error);
    }
};


const close = async() => {
    await oracledb.getPool().close();
};

const simpleExecute = (statement, binds = [], opts = {}) => new Promise(async(resolve, reject) => {
    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    try {
        conn = await oracledb.getConnection(dbConfig.eventsPool);
        const result = await conn.execute(statement, binds, opts);
        resolve(result);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});

const bacherExecute = (statement, binds = [], opts = {}) => new Promise(async(resolve, reject) =>{
    SimpleOracleDB.extend(oracledb);
    var doconnect = function(cb) {
        oracledb.getConnection(
        {
          user          : dbCdbConfig.eventsPoolonfig.user,
          password      : dbConfig.eventsPoolonfig.password,
          connectString : dbConfig.eventsPoolonfig.connectString
        },
        cb);
       };

    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    opts.batchErrors = true;

    try{
        conn = await oracledb.getConnection(dbConfig.eventsPool);
        const result = await conn.batchInsert(statement, binds, opts);
        //const result = await conn.executeMany(statement, binds, opts);
        const resultSet = await result.outBinds;
        resolve(resultSet);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }

});

const manyExecute = (statement, binds = [], opts = {}) => new Promise(async(resolve, reject) => {
    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    opts.batchErrors = true;

    try {
        conn = await oracledb.getConnection(dbConfig.eventsPool);
        const result = await conn.executeMany(statement, binds, opts);
        const resultSet = await result.outBinds;
        resolve(resultSet);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});

const procedureExecuteCursor = (statement, binds = [], opts = {}) => new Promise(async(resolve, reject) => {
    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    try {
        const data = [];
        conn = await oracledb.getConnection();
        const result = await conn.execute(statement, binds, opts);
        const resultSet = await result.outBinds.cursor;
        let row;
        while ((row = await resultSet.getRow())) {
            data.push(row);
        }
        await resultSet.close();
        result.outBinds.cursor = data;
        resolve(result.outBinds);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});

const procedureExecute = (statement, binds = [], opts = {}) => new Promise(async(resolve, reject) => {
    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    try {
        conn = await oracledb.getConnection();
        const result = await conn.execute(statement, binds, opts);
        const resultSet = await result.outBinds;
        resolve(resultSet);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});


const procedureExecuteCursorsArray = (statement, binds = [], opts = {},) => new Promise(async(resolve, reject) => {
    const cursors = extractCursors(binds);
    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    try {
        conn = await oracledb.getConnection();
        let resultGeneral = await conn.execute(statement, binds, opts);
       
        const result = { };
        const data = await Promise.all(cursors.map(async(cursor) => {
            const cursorData = await procedureExecuteSpecificCursor(statement, binds, opts, cursor);
            return cursorData;
        }));  

        for (let i = 0 ; i < cursors.length ; i++) {
            result[cursors[i]] = data[i];
        }

        Object.keys(resultGeneral.outBinds).forEach(ele => {
            if (!result[ele]) {
                result[ele] = resultGeneral.outBinds[ele];
            }
        });
        resolve(result);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});

const procedureExecuteSpecificCursor = (statement, binds = [], opts = {}, cursor) => new Promise(async(resolve, reject) => {
    let conn;
    if (!opts.outFormat) {
        opts.outFormat = oracledb.OBJECT;
    }
    opts.autoCommit = true;
    try {
        const data = [];
        conn = await oracledb.getConnection();
        const result = await conn.execute(statement, binds, opts);        
        const resultSet = await result.outBinds[cursor];
        let row;
        while ((row = await resultSet.getRow())) {
            data.push(row);
        }
        await resultSet.close();
        resolve(data);
    } catch (err) {
        reject(err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});


module.exports = {
    initialize,
    close,
    simpleExecute,
    manyExecute,
    procedureExecute,
    procedureExecuteCursor,
    procedureExecuteCursorsArray,
    bacherExecute
};
