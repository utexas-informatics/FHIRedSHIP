const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var ruleService = require('../services/rule.service');


var get = async function (req, res, next) {
  logger.info(`rule : controller : get  : received request`);
  try {
    const responses = await ruleService.get(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save response!';
    logger.error(`Response : controller : get : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

module.exports.get = get;