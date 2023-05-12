/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const patientController = require('../controllers/patient.controller');
var verify = require('../middleware');

router.get(
  '/',
  kc.enforcer(['getPatient']),
  verify.validateRoleWithToken,
  patientController.get
);
router.get(
  '/:id/assessments',
  kc.enforcer(['getPatientAssessment']),
  verify.validateRoleWithToken,
  // verify.verifyToken,
  patientController.getAassessments
);
router.get(
  '/questionnaireresponse/:id',
  kc.enforcer(['getPatientResponse']),
  verify.validateRoleWithToken,
  verify.verifyApi,
  patientController.getQuestionnaireresponse
);
module.exports = router;
 