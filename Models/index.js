const validateUser = require('./users');
const validateDocuments = require('./documents');
const { validateNews, validateLettersNews, validateLink } = require('./news');


module.exports = {
    validateUser,
    validateDocuments,
    validateNews,
    validateLettersNews,
    validateLink
};