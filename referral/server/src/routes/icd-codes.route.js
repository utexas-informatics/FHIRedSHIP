const router = require('express').Router();
const icdCodesController = require('../controllers/icd-codes.controller');
const verify = require("../middleware");

router.get('/',verify.verifyToken,icdCodesController.get);

module.exports = router;