const dbConfig = require('./Settings/Environment/config');
const webServer = require('./Settings/Server/webServer');
const database = require('./Settings/Database/database');
const defaultThreadPoolSize = 3;
process.env.UV_THREADPOOL_SIZE = dbConfig.eventsPool.poolMax + defaultThreadPoolSize;


const startup = async() => {
    console.log( 'Information => Load service'+ process.env.URL)
    console.log('Information => Load service');
    try {
        console.log('Information => Load Database');
        await database.initialize();
    } catch (err) {
        console.log('Information => Error Load database ');
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
    try {
        console.log('Information => Load Server');
        await webServer.initialize();
    } catch (err) {
        console.log('Information => Error Load Server ');
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
};
startup();

const shutdown = async(e) => {
    let err = e;

    console.log('Information => Shutdown ');
    try {
        console.log('Information => Shutdown Server ');
        await webServer.close();      
    } catch (e) {
        console.error(e);
        err = err || e;
    }
    try {
        console.log('Information => Shutdown Database ');
        await database.close();
    } catch (e) {
        console.log('Information =>Error Shutdown Database ');
        console.error(e);
        err = err || e;
    }

    if (err) {
        console.log(1);
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);       
    }
};

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    shutdown();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT');
    shutdown(); 
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);
    shutdown(err);
});