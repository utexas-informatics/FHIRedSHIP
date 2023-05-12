/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
const assessmentsController = require('../controllers/assessments.controller');
var verify = require('../middleware');

router.get(
  '/:id',
  kc.enforcer(['getAssessment']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  assessmentsController.getById
);

module.exports = router;
