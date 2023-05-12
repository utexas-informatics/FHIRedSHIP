const router = require('express').Router();
const questionnaireresponseController = require('../controllers/questionnaireresponse.controller');
const verify = require("../middleware");
router.get('/:id',verify.verifyToken, questionnaireresponseController.getById);
router.get('/patient/:id',verify.verifyToken, questionnaireresponseController.getByPatId);
router.post('/',verify.verifyToken, questionnaireresponseController.save);
router.put('/',verify.verifyToken, questionnaireresponseController.updateRes);
router.get('/', verify.verifyToken,questionnaireresponseController.getQuestionnaiReresponses);
module.exports = router;