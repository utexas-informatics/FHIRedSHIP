const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var notesService = require('../services/notes.service');



var save = async function (req, res, next) {
  logger.info(`Notes : controller : save Notes : received request`);
  try {
    const responses = await notesService.save(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save notes!';
    logger.error(`Response : controller : SaveNotes : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var update = async function (req, res, next) {
  logger.info(`Notes : controller : Update Notes : received request`);
  try {
    const responses = await notesService.update(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to update notes!';
    logger.error(`Response : controller : SaveNotes : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var remove = async function (req, res, next) {
  logger.info(`Notes : controller : Remove Notes : received request`);
  try {
    const responses = await notesService.remove(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to remove notes!';
    logger.error(`Response : controller : Remove Notes : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var get = async function (req, res, next) {
  logger.info(`Notes : controller : get Notes : received request`);
  try {
    const responses = await notesService.get(req,res);
    res.status(200).json({status:true,notes:responses});
  } catch (e) {
    var error = 'Failed to get notes!';
    logger.error(`Response : controller : get Notes : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}
module.exports.get = get;
module.exports.remove = remove;
module.exports.save = save;
module.exports.update = update;