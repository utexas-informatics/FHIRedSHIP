const router = require('express').Router();
const sharedController = require('../controllers/sharedTemplate.controller');
var verify = require('../middleware');
router.post('/',verify.verifyToken, sharedController.share);
router.post('/get',verify.verifyToken, sharedController.get);
router.post('/check',verify.verifyToken,sharedController.check);

module.exports = router;
