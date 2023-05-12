const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var assessmentsService = require('../services/assessments.service');
var helperService = require('../services/helper.service');


var getById = async function (req, res, next) {
  logger.info(`condition : controller : assessment form : received request`);
  try {
    const responses = await assessmentsService.getById(req, res);
    //const helperRes = await helperService.convertAsssesmentsFhirBundleToSimpleJson(responses.data);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to getQuestionnaireresponses!';
    logger.error(`condition : controller : getQuestionnaireresponses : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



module.exports.getById = getById;