const router = require('express').Router();
const referralController = require('../controllers/referral.controller');
var verify = require('../middleware');

router.get('/user/:id', verify.verifyToken,referralController.get);
router.get('/', verify.verifyToken,referralController.getReferrals);
router.get('/:id',verify.verifyToken, referralController.getReferral);
router.post('/',verify.verifyToken, referralController.save);
router.put('/',verify.verifyToken, referralController.update);
router.put('/:id',verify.verifyToken,referralController.updateStatus);
module.exports = router;