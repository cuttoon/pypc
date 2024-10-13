require('dotenv').config();
module.exports = {
    eventsPool: {
        user: process.env.USER,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTIONSTRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0,
        poolTimeout: 300
    },
    port: process.argv[2] || process.env.PORT,
    secret: process.env.SECRET_KEY,
    serverUrl: process.env.SERVER 
};

