const http = require('http');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const pkg = require('../../package.json');
const routes = require('../router');
const authMiddleware = require('./middleware/permissions');
const errorHandler = require('./middleware/errors');
const dbConfig = require('../Environment/config');
const { corsOptions } = require('../Cors');
const { port, secret, serverUrl } = dbConfig;



let httpServer;
const initialize = () => new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
    app.set('config', dbConfig);
    app.set('pkg', pkg);
    app.set('etag', 'strong');
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(morgan('combined'));
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

    app.use('/media', express.static(path.join(path.resolve(), 'media')));
  
    app.use(authMiddleware(secret));
    routes(app, (err) => {
        if (err) {
            throw err;
        }
        app.use(errorHandler);

        httpServer.listen(port)
            .on('listening', () => {
                console.log(`Web server listening on ${serverUrl}:${port}`);
                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
   
});

const close = () => new Promise((resolve, reject) => {
    httpServer.close((err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});


module.exports = {
    initialize,
    close
};