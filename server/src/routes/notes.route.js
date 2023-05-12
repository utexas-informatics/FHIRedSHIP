/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const notesController = require('../controllers/notes.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/save',
  kc.enforcer(['saveNote']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notesController.save
);
router.put(
  '/update',
  kc.enforcer(['updateNote']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notesController.update
);
router.delete(
  '/remove/:id',
  kc.enforcer(['removeNote']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notesController.remove
);
router.get(
  '/get',
  kc.enforcer(['getNote']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  notesController.get
);
module.exports = router;
