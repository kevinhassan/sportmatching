const express = require('express');
const router = express.Router();

const utilisateur = require('./utilisateur');
const sport = require('./sport');
const notification = require('./notification');
const ville = require('./ville');
const terrain = require('./terrain');
const attendre = require('./attendre');
const partie = require('./partie');
const models = require('../models');
const errorHandler = require('../middlewares/errorHandler');

router.use('/utilisateurs',utilisateur);
router.use('/sports',sport);
router.use('/notifications',notification);
router.use('/villes',ville);
router.use('/terrains',terrain);
router.use('/parties',partie);
router.use('/attentes',attendre);

module.exports = router;