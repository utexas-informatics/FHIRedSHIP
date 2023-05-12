const router = require('express').Router();
const userController = require('../controllers/user.controller');
var verify = require('../middleware');

router.post('/link',verify.verifyToken,userController.link);
router.get('/patient',verify.verifyToken, userController.getPatient);
router.get('/patient/email/:email',verify.verifyToken, userController.searchPatient);
router.get('/patient/search/:text',verify.verifyToken, userController.searchPatients);
router.get('/patient/search',verify.verifyToken, userController.searchPatients);
router.get('/cbo/search/:text', verify.verifyToken,userController.searchCbos);
router.get('/cbo/search',verify.verifyToken, userController.searchCbos);
router.post('/login', userController.login);
router.get('/getDetails',verify.verifyToken, userController.getDetails);
router.post('/getToken',verify.verifyToken, userController.getToken);
router.post('/getRefToken',verify.verifyToken, userController.getRefToken);
// router.post('/passwordGenerate', userController.generatePassword);
router.post('/isAuthenticated',verify.verifyToken,userController.isAuthenticated);

module.exports = router;
