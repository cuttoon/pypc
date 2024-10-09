//const { dbUsers } = require('../Settings/Database/database')
const userdb   = require('../Service/authService/Serviceusers')

const existEmail = async(email) => {
    const user = await userdb.existEmail(email);
    return user ? true : false;
};

const existEmailUpdate = async(email,ids) => {
    const user = await userdb.existEmailUpdate(email,ids);
    return user ? true : false;
};

module.exports = {
    existEmail,
    existEmailUpdate,
};