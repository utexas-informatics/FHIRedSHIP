const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var messageService = require('../services/message.service');

var save = async function (req, res, next) {
  logger.info(`message : controller : save : received request`);
  try {
    var response = await messageService.save(req);
    res.json(response);
  } catch (e) {
    var error = 'Failed to save!';
    logger.error(`message : controller : save : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var getByRoomId = async function (req, res, next) {
  logger.info(`message : controller : getByRoomId : received request`);
  try {
    var response = await messageService.getByRoomId(req,res);
    res.json(response);
  } catch (e) {
    var error = 'Failed to getByRoomId!';
    logger.error(`message : controller : getByRoomId : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}



module.exports.getByRoomId = getByRoomId;
module.exports.save = save;