const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var settingsService = require('../services/settings.service');



var enableCalendly = async function (req, res, next) {
  logger.info(`settings : controller : Enable Calendly : received request`);
  try {
    const responses = await settingsService.enableCalendly(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to enable Calendly!';
    logger.error(`Settings : controller : Enable Calendly : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var accountChange = async function (req, res, next) {
  logger.info(`settings : controller : Account Change Calendly : received request`);
  try {
    const responses = await settingsService.accountChange(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to Account Change Calendly!';
    logger.error(`Settings : controller : Account Change Calendly : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}
var disableCalendly = async function (req, res, next) {
  logger.info(`settings : controller : Disable Calendly : received request`);
  try {
    const responses = await settingsService.disableCalendly(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to Disable Calendly!';
    logger.error(`Settings : controller : Disable Calendly : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



var enableReferral = async function (req, res, next) {
  logger.info(`settings : controller : Enable Referral : received request`);
  try {
    const responses = await settingsService.enableReferral(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to enable Referral!';
    logger.error(`Settings : controller : Enable Referral : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var refAccountChange = async function (req, res, next) {
  logger.info(`settings : controller : Account Change Referral : received request`);
  try {
    const responses = await settingsService.accountChange(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to Account Change Referral!';
    logger.error(`Settings : controller : Account Change Referral : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}
var disableReferral = async function (req, res, next) {
  logger.info(`settings : controller : Disable Referral : received request`);
  try {
    const responses = await settingsService.disableReferral(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to Disable Referral!';
    logger.error(`Settings : controller : Disable Referral : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}


var get = async function (req, res, next) {
  logger.info(`settings : controller : Get Settings : received request`);
  try {
    const responses = await settingsService.get(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to enable Calendly!';
    logger.error(`Settings : controller : Get Setting : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}






module.exports.accountChange = accountChange;
module.exports.enableCalendly = enableCalendly;
module.exports.disableCalendly = disableCalendly;

module.exports.refAccountChange = refAccountChange;
module.exports.enableReferral = enableReferral;
module.exports.disableReferral = disableReferral;


module.exports.get = get;
