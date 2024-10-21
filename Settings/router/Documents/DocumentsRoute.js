const express = require('express');
const router = express.Router();
const { Documents, News } = require('../../../Controllers');
const  { Filter  } = require('../../Server/middleware/permissions');
const { checkMaterials, checkPDFs, checkreports, checkPictures } = require('../../Media/media');

router.post('/createDocument', Filter, checkMaterials, Documents.createDocuments);
router.post('/clasification', Filter, Documents.createClasification);
router.post('/insertPDF', Filter, checkPDFs, Documents.insertPDF);

router.get('/getAllDocuments',Filter, Documents.getAllDocuments);
router.post('/getDetail', Documents.getDetail)
router.post('/getSimpleSearch', Documents.getSimpleSearch);
router.post('/postAdvanceSearch', Documents.postAdvanceSearch);
router.post('/postModelGraph', Documents.postModelGraph);
router.post('/postInteractionGraph', Documents.postInteractionGraph);
router.post('/postPhaseGraph', Documents.postPhaseGraph);
router.post('/postGeoGraph', Documents.postGeoscopeGraph);


router.post('/createNews', Filter, checkPictures, News.createNews);
router.post('/createLetters', Filter, checkreports, News.createLetters);
router.post('/createExternalLink', Filter, News.createExternalLink);


module.exports = (app, nextMain) => {
    app.use('/pypc/documents', router);
    return nextMain();
};