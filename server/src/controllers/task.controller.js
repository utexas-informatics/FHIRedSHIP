const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var taskService = require('../services/task.service');

var getTasks = async function (req, res, next) {
  logger.info(`task : controller : getTasks : received request`);
  try {
    const responses = await taskService.getTasks(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to get tasks!';
    logger.error(`task : controller : getTasks : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var save = async function (req, res, next) {
  logger.info(`task : controller : save : received request`);
  try {
    const responses = await taskService.save(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save tasks';
    logger.error(`task : controller : save : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var update = async function (req, res, next) {
  logger.info(`task : controller : update : received request`);
  try {
    const responses = await taskService.update(req, res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to update task';
    logger.error(`task : controller : update : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.update = update;
module.exports.save = save;
module.exports.getTasks = getTasks;
