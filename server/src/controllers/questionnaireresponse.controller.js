const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var questionnaireresponseService = require('../services/questionnaireresponse.service');
var helperService = require('../services/helper.service');


var getQuestionnaireresponses = async function (req, res, next) {
  logger.info(`condition : controller : getQuestionnaireresponses : received request`);
  try {
    const responses = await questionnaireresponseService.getQuestionnaireresponses(req, res);
    const helperRes = await helperService.convertAsssesmentsFhirBundleToSimpleJson(responses.data);
    res.status(200).json({data:helperRes,status:true,count:responses.count});
  } catch (e) {
    var error = 'Failed to getQuestionnaireresponses!';
    logger.error(`condition : controller : getQuestionnaireresponses : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



module.exports.getQuestionnaireresponses = getQuestionnaireresponses;