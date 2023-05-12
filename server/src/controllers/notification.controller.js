/* eslint-disable linebreak-style */
const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var notificationService = require('../services/notification.service');

var callback = async function (req, res, next) {
  logger.info(`notification : controller : callback : received request`);
  try {
    var response = await notificationService.callback(req, res);
    res.json(response);
  } catch (e) {
    var error = 'Failed to create notification';
    logger.error(`notification : controller : callback : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}; 


var get = async function (req, res, next) {
  logger.info(`notification : controller : get : received request`);
  try {
    var response = await notificationService.get(req, res);
    res.json(response);
  } catch (e) {
    var error = 'Failed to get notification';
    logger.error(`notification : controller : get : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var update = async function (req, res, next) {
  logger.info(`notification : controller : update : received request`);
  try {
    const responses = await notificationService.update(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to update notification';
    logger.error(`notification : controller : update : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getById = async function (req, res, next) {
  logger.info(`notification : controller : getById : received request`);
  try {
    const responses = await notificationService.getById(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to getById';
    logger.error(`notification : controller : getById : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getByRoomId = async function (req, res, next) {
  logger.info(`notification : controller : getByRoomId : received request`);
  try {
    const responses = await notificationService.getByRoomId(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to getByRoomId';
    logger.error(`notification : controller : getByRoomId : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var updateAll = async function (req, res, next) {
  logger.info(`notification : controller : updateAll : received request`);
  try {
    const responses = await notificationService.updateAll(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to updateAll notification';
    logger.error(`notification : controller : updateAll : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.getByRoomId = getByRoomId;
module.exports.updateAll = updateAll;
module.exports.getById = getById;
module.exports.update = update;
module.exports.get = get;
module.exports.callback = callback;