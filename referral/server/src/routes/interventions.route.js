const router = require('express').Router();
const interventionController = require('../controllers/interventions.controller');
const verify = require("../middleware");

router.get('/', verify.verifyToken, interventionController.get);

module.exports = router;