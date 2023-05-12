/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const messageController = require('../controllers/message.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/',
  kc.enforcer(['saveMessage']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  messageController.save
);
router.get(
  '/:roomId',
  kc.enforcer(['getMessage']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  messageController.getByRoomId
);

module.exports = router;
