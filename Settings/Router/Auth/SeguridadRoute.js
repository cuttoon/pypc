const express = require('express');
const router = express.Router();
const { Security } = require('../../../Controllers');
const  { Filter , Destroy } = require('../../Server/middleware/permissions');
//registrar
router.post('/Signup', Security.Signup);
//loguear
router.post('/Signin', Security.Signin);
router.post('/Signoff', Destroy);


module.exports = (app, nextMain) => {
    app.use('/pypc/security', router);
    return nextMain();
};