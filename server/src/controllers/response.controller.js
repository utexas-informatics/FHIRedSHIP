const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var responseService = require('../services/response.service');



var saveResponse = async function (req, res, next) {
  logger.info(`condition : controller : save Response : received request`);
  try {
    console.log("save data controller",req.body);
    const responses = await responseService.save(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save response!';
    logger.error(`Response : controller : SaveResponse : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var updateResponse = async function (req, res, next) {
  logger.info(`condition : controller : update Response : received request`);
  try {
    console.log("update response controller",req.body);
    const responses = await responseService.update(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to update response!';
    logger.error(`Response : controller : SaveResponse : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var getResponse = async function (req, res, next) {
  logger.info(`condition : controller : get response : received request`);
  try {
    console.log("get response controller",req.body);
    const responses = await responseService.get(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save response!';
    logger.error(`Response : controller : GetResponse : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var getAll = async function (req, res, next) {
  logger.info(`condition : controller : get response : received request`);
  try {

    const responses = await responseService.getAll(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save response!';
    logger.error(`Response : controller : Get All Response : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}


module.exports.getAll = getAll;
module.exports.updateResponse = updateResponse;
module.exports.getResponse = getResponse;
module.exports.saveResponse = saveResponse;