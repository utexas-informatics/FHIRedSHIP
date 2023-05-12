/* eslint-disable linebreak-style */
var router = require('express').Router();
var logger = require('../config/logger');
var roles = require('../models/role');
var users = require('../models/users');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');

// TBD - middleware to parse and process routes under '/api/*' for common validations, auth etc..
router.use((req, res, next) => {
  // TBD - verify token with IDP here..
  logger.info(`api router : middleware : path : ${req.path}`);
  // get admin name to be used through out the session
  res.locals.adminName = 'admin user ';
  // get admin name to be used through out the session
  if (req.headers.userId) {
    res.locals.userId = req.headers.userId;
  } 
  roles.findOne({ role: 'Admin' }, (er, role) => {
    if (role) {
      users.findOne({ role: role._id }, (err, adminUser) => {
        if (adminUser) {
          res.locals.adminId = adminUser._id;
          res.locals.adminName = `${adminUser.firstName} ${adminUser.lastName}`;
          next();
        } else {
          // const message = `admin user not found`;
          // logger.error(
          //   `api router : middleware : error : ${err} : message : ${message}`
          // ); 
          // next(
          //   errorResponse.build(
          //     constants.error.internalServerError,
          //     err,
          //     message
          //   )
          // );
          next();
        }
      });
    } else {
      next();
      // TBD - throw error if admin role not found and use fallback admin name in the mean while?
    }
  });
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('bearer') &&
    (req.headers.patientid || req.headers.researcherid)
  ) {
    res.locals.patientId = req.headers['patientid'];
    res.locals.researcherId = req.headers['researcherid'];
    res.locals.userRole = req.headers['userrole'];
  }
});


router.use('/user', require('./user.route'));
router.use('/task', require('./task.route'));
router.use('/patient', require('./patient.route'));
router.use('/questionnaireresponse', require('./questionnaireresponse.route'));
router.use('/assessments', require('./assessments.route'));
router.use('/audit', require('./audit.route'));
router.use('/referral', require('./referral.route'));
router.use('/condition', require('./condition.route'));
router.use('/fileupload', require('./fileupload.route'));
router.use('/notification', require('./notification.route'));
router.use('/message', require('./message.route'));
router.use('/templates', require('./template.route'));
router.use('/responses', require('./response.route'));
router.use('/notes', require('./notes.route'));
router.use('/share', require('./share.route'));
router.use('/appointment', require('./appointment.route'));
router.use('/rule', require('./rule.route'));
router.use('/settings', require('./settings.route'));

module.exports = router;
