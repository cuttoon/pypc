const Security = require('./auth/securityController');
const User = require('./user/userController');
const Common = require('./common/commonController')
const Documents = require('./document/documentsController')
const News = require('./news/newsController');
module.exports = {
    Security,
    User,
    Common,
    Documents,
    News
};