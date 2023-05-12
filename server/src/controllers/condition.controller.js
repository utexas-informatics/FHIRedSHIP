const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var condService = require('../services/condition.service');
var helperService = require('../services/helper.service');


var getConditions = async function (req, res, next) {
  logger.info(`condition : controller : getConditions : received request`);
  try {
    const responses = await condService.getConditions(req, res);
    const helperRes = await helperService.convertConditionFhirBundleToSimpleJson(responses.data);
    res.status(200).json(helperRes);
  } catch (e) {
    var error = 'Failed to getConditions!';
    logger.error(`condition : controller : getConditions : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



module.exports.getConditions = getConditions;