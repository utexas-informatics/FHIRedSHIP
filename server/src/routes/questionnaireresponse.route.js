/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
const questionnaireresponseController = require('../controllers/questionnaireresponse.controller');
var verify = require('../middleware');

router.get(
  '/',
  kc.enforcer(['getQuestionnaireresponse']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  questionnaireresponseController.getQuestionnaireresponses
);

module.exports = router;
