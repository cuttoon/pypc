const express = require('express');
const router = express.Router();
const { Documents } = require('../../../Controllers');
const  { Filter  } = require('../../Server/middleware/permissions');
const { checkMaterials } = require('../../Media/media');

router.post('createDocument', Filter, checkMaterials, Documents.createDocuments);


router.get('/getAllDocuments',Filter, Documents.getAllDocuments);
router.post('/getDetail', Documents.getDetail)
router.post('/getSimpleSearch', Documents.getSimpleSearch);
router.post('/postAdvanceSearch', Documents.postAdvanceSearch);
router.post('/postModelGraph', Documents.postModelGraph);
router.post('/postInteractionGraph', Documents.postInteractionGraph);
router.post('/postPhaseGraph', Documents.postPhaseGraph);
router.post('/postGeoGraph', Documents.postGeoscopeGraph);


module.exports = (app, nextMain) => {
    app.use('/pypc/documents', router);
    return nextMain();
};