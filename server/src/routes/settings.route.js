const router = require('express').Router();
const settingsController = require('../controllers/settings.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/calendly/enable',
  kc.enforcer(['enableSetting']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  settingsController.enableCalendly
);
router.post(
  '/calendly/account/change',
  verify.validateRoleWithToken,
  kc.enforcer(['changeSetting']),
  settingsController.accountChange
);
router.put(
  '/calendly/disable',
  verify.validateRoleWithToken,
  kc.enforcer(['updateSetting']),
  settingsController.disableCalendly
);
router.get(
  '/getAll',
  verify.validateRoleWithToken,
  kc.enforcer(['getSetting']),
  settingsController.get
);

router.post('/referral/enable',verify.validateRoleWithToken,settingsController.enableReferral);
router.put('/referral/disable',verify.validateRoleWithToken,settingsController.disableReferral);



module.exports = router; 