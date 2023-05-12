const router = require('express').Router();
const callbackController = require('../controllers/callback.controller');
const verify = require("../middleware");
router.post('/',verify.verifyToken,callbackController.callback);

module.exports = router;