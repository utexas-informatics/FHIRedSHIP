/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
const referralController = require('../controllers/referral.controller');
var verify = require('../middleware');

router.get(
  '/',
  kc.enforcer(['getReferral']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  referralController.getReferrals
);
router.get(
  '/:id',
  kc.enforcer(['getReferral']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  referralController.getReferral
);
router.put(
  '/status/:id',
  kc.enforcer(['updateRefStatus']),
  verify.validateRoleWithToken,
  referralController.statusUpdate
);

router.post('/nextstep/notify',verify.verifyToken,referralController.nextstep)


module.exports = router;
