const Security = require('./auth/securityController');
const User = require('./user/userController');
const Documents = require('./documents/documentsController');
const Common = require('./common/commonController')
module.exports = {
    Security,
    User,
    Documents,
    Common
};