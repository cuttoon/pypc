const express = require('express');
const router = express.Router();
const { Security } = require('../../../Controllers');
const  { Destroy } = require('../../Server/middleware/permissions');
//registrar
router.post('/Signup', Security.Signup);
//loguear
router.post('/Signin', Security.Signin);
router.post('/Signoff', Destroy);

router.post('/ForgotPassword', Security.ForgotPassword);
// para restablecerlo
router.post('/ResetPassword', Security.ResetPassword);
router.post('/sendEmail', Security.SendEmail);

module.exports = (app, nextMain) => {
    app.use('/pypc/security', router);
    return nextMain();
};