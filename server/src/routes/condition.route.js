/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
const conditionController = require('../controllers/condition.controller');
var verify = require('../middleware');

router.get(
  '/',
  kc.enforcer(['getCondition']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  conditionController.getConditions
);

module.exports = router;
