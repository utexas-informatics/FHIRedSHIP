/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const shareController = require('../controllers/share.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/',
  kc.enforcer(['shareForm']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  shareController.shareForm
);

module.exports = router;
