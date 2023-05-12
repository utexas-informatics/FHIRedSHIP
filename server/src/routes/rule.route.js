const router = require('express').Router();
const ruleController = require('../controllers/rule.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.get('/:id', 
kc.enforcer(['getRule']),
verify.validateRoleWithToken, 
ruleController.get
);

module.exports = router;
