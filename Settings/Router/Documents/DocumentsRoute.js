const express = require('express');
const router = express.Router();
const { Documents } = require('../../../Controllers');
const  { Filter  } = require('../../Server/middleware/permissions');

router.get('/getAllDocuments',Filter, Documents.getAllDocuments);
router.post('/getDetail', Documents.getDetail)
router.post('/getSimpleSearch', Documents.getSimpleSearch);
router.post('/getAdvanceSearch', Documents.getAdvanceSearch);
router.post('/postModelGraph', Documents.postModelGraph);
router.post('/postInteractionGraph', Documents.postInteractionGraph);
router.post('/postPhaseGraph', Documents.postPhaseGraph);


module.exports = (app, nextMain) => {
    app.use('/pypc/documents', router);
    return nextMain();
};