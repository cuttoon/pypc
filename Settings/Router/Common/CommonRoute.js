const express = require('express');
const router = express.Router();
const { Common } = require('../../../Controllers');

router.get('/getAllSAI', Common.getAllSAI);
router.get('/getAllCategory', Common.getAllCategory);
router.get('/getAllModels', Common.getAllModels);
router.get('/getAllGeoscope', Common.getAllGeoscope);
router.get('/getAllInteractions', Common.getAllInteractions);
router.get('/getAllPhase', Common.getAllPhase);

module.exports = (app, nextMain) => {
  app.use('/pypc/common', router);
  return nextMain();
};