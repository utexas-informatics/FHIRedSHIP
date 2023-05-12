/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const taskController = require('../controllers/task.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/',
  kc.enforcer(['createTask']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  taskController.save
);
router.get(
  '/:id',
  kc.enforcer(['getTask']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  taskController.getTasks
);
router.put(
  '/:id',
  kc.enforcer(['updateTask']),
  verify.validateRoleWithToken,
  taskController.update
);

module.exports = router;
