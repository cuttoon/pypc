const Security = require('./auth/securityController');
const User = require('./user/userController');
const Common = require('./common/commonController')
const Documents = require('./document/documentsController')
module.exports = {
    Security,
    User,
    Common,
    Documents
};