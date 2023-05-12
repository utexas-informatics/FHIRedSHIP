const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var patService = require('../services/pat.service');
var helperService = require('../services/helper.service');

var get = async function (req, res, next) {
  logger.info(`user : controller : get : received request`);
  try {
    const pats = await patService.get(req, res);
    res.status(200).json(pats);
  } catch (e) {
    var error = 'Failed to get!';
    logger.error(`user : controller : get : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}


var getAassessments = async function (req, res, next) {
  logger.info(`user : controller : getAassessments : received request`);
  try {
    const responses = await patService.getAassessments(req, res);
    const helperRes = await helperService.convertAsssesmentsFhirBundleToSimpleJson(responses.data);
    res.status(200).json(helperRes);
  } catch (e) {
    var error = 'Failed to getAassessments!';
    logger.error(`user : controller : getAassessments : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



var getQuestionnaireresponse = async function (req, res, next) {
  logger.info(`user : controller : getQuestionnaireresponse : received request`);
  try {
    const assRes = await patService.getQuestionnaireresponse(req, res);
    res.status(200).json(assRes);
  } catch (e) {
    var error = 'Failed to getQuestionnaireresponse!';
    logger.error(`user : controller : getQuestionnaireresponse : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

module.exports.getQuestionnaireresponse = getQuestionnaireresponse;
module.exports.getAassessments = getAassessments;
module.exports.get = get;