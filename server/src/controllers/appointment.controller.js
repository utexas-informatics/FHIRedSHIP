const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var appointmentService = require('../services/appointment.service');
 

var callback = async function (req, res, next) {
   let resp = await appointmentService.callback(req, res);
   res.status(200).json({status:200});
}

 var getAll = async function (req, res, next) {
    logger.info(`appointment : controller : getAll : received request`);
    try {
      const responses = await appointmentService.getAll(req, res);
      res.status(200).json(responses);
    } catch (e) {
      var error = 'Failed to get appointments!';
      logger.error(`appointment : controller : getAll : Error : ${e}`);
      next(
        errorResponse.build(constants.error.internalServerError, error, e.message)
      );
    }
  };

 var cancel = async function (req, res, next) {
    logger.info(`appointment : controller : cancel appointment : received request`);
    try {
      const responses = await appointmentService.cancel(req, res);
      res.status(200).json(responses);
    } catch (e) {
      var error = 'Failed to cancel appointment!';
      logger.error(`appointment : controller : cancel appointment : Error : ${e}`);
      next(
        errorResponse.build(constants.error.internalServerError, error, e.message)
      );
    }
  };

module.exports.cancel = cancel;
module.exports.getAll = getAll;
module.exports.callback = callback;
