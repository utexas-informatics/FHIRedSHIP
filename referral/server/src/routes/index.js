var router = require('express').Router();
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');


// TBD - middleware to parse and process routes under '/api/*' for common validations, auth etc..
// router.use((req, res, next) => {
//   if (req.headers.authorization) {
//     const token = Buffer.from(
//       req.headers.authorization.split('Basic ')[1],
//       'base64'
//     ).toString('binary');
//     const user = token.substring(0, token.indexOf(':'));
//     const pass = token.substring(token.indexOf(':')+1);
//     if (user === process.env.USER_FHIRed && pass === process.env.PASS_FHIRed) {
//       next();
//     } else {
//       return res
//         .status(401)
//         .json({ message: 'Invalid Authentication Credentials' });
//     }
//   } else {
//     next();
// }
// });





router.use('/user', require('./user.route'));
router.use('/questionnaireresponse', require('./questionnaireresponse.route'));
router.use('/condition', require('./condition.route'));
router.use('/referral', require('./referral.route'));
router.use('/share', require('./sharedTemplate.route'));
router.use('/Questionnaire', require('./assessment.route'));
router.use('/assessment', require('./assessment.route'));
router.use('/code', require('./icd-codes.route'));
router.use('/interventions', require('./interventions.route'));
router.use('/callback', require('./callback.route'));

module.exports = router;
