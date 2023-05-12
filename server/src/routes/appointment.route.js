/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const appointmentController = require('../controllers/appointment.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post('/callback',appointmentController.callback);
router.get(
  '/',
  kc.enforcer(['getAppointment']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  appointmentController.getAll
);
router.put(
  '/cancel',
  kc.enforcer(['cancelAppointment']),
  verify.validateRoleWithToken,
  appointmentController.cancel
);

module.exports = router;
