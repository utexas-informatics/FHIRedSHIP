const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
const userRoleController = require('../controllers/userRole.controller');

//from backend
router.post('/', kc.enforcer(['addUserRole']), userRoleController.addUserRole);

module.exports = router;
