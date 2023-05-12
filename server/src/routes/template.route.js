/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const formController = require('../controllers/template.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.get(
  '/:id',
  kc.enforcer(['getTemplate']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  formController.getFormById
);
router.get(
  '/',
  kc.enforcer(['getAllTemplate']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  formController.getAll
);

module.exports = router;
