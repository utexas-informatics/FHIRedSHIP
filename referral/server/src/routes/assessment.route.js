const router = require('express').Router();
const assessmentController = require('../controllers/assessment.controller');

const verify = require("../middleware");

router.get('/:id',verify.verifyToken, assessmentController.getById);
router.get('/',verify.verifyToken,assessmentController.get);

module.exports = router;
