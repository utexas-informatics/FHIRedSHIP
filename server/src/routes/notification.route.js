/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post('/callback', notificationController.callback);
router.get(
  '/',
  kc.enforcer(['getNotification']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notificationController.get
);
router.get(
  '/:id',
  kc.enforcer(['getNotification']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notificationController.getById
);

router.get(
  '/room/:id',
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notificationController.getByRoomId
);
router.put(
  '/:id',
  kc.enforcer(['updateNotification']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notificationController.update
);
router.put(
  '/updateAll/:id',
  kc.enforcer(['updateNotification']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notificationController.updateAll
);

module.exports = router;
