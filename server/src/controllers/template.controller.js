const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var formService = require('../services/template.service');



var getFormById = async function (req, res, next) {
  logger.info(`condition : controller : getForm : received request`);
  try {
    const responses = await formService.getFormById(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to get form!';
    logger.error(`form : controller : getFormById : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



var getAll = async function (req, res, next) {
  logger.info(`Forms : controller : getAll Forms : received request`);
  try {
    const responses = await formService.getAll(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to get form!';
    logger.error(`form : controller : getAll Forms : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}


module.exports.getAll = getAll;
module.exports.getFormById = getFormById;