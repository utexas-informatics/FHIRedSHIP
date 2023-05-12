/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const fileuploadController = require('../controllers/fileupload.controller');
var verify = require('../middleware');
const kc = require('../config/keycloak-config.js').getKeycloak();

router.post(
  '/',
  kc.enforcer(['uploadFiles']),
  // verify.verifyApi,
  verify.validateRoleWithToken,
  fileuploadController.uploadFile
);
router.get(
  '/',
  kc.enforcer(['getFile']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  fileuploadController.get
);
router.delete(
  '/',
  kc.enforcer(['removeFile']),
  verify.validateRoleWithToken,
  //verify.verifyApi,
  fileuploadController.remove
);
module.exports = router;
