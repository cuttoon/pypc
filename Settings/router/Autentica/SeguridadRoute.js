const express = require('express');
const router = express.Router();
const { Security } = require('../../../Controllers');
const  { Filter , Destroy } = require('../../Server/midlewar/permissions');
//registrar
router.post('/Signup', Security.Signup);
//loguear
router.post('/Signin', Security.Signin);
router.post('/Signoff', Destroy);

//olvidar contraseña
router.post('/ForgotPassword', Security.ForgotPassword);

// para restablecerlo
router.post('/ResetPassword', Security.ResetPassword);


module.exports = (app, nextMain) => {
    app.use('/intosai/security', router);
    return nextMain();
};

