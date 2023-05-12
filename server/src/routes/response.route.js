/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const responseController = require('../controllers/response.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/save',
  kc.enforcer(['saveResponse']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  responseController.saveResponse
);
router.put(
  '/update',
  kc.enforcer(['updateResponse']),
  verify.validateRoleWithToken,
  responseController.updateResponse
);
router.get(
  '/:id',
  kc.enforcer(['getResponse']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  responseController.getResponse
);
router.get(
  '/',
  kc.enforcer(['getAllResponse']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  responseController.getAll
);

module.exports = router;
