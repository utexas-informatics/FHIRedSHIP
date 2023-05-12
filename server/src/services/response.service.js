const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const responseDao = require('../dao/response.dao');

var save = async function(req,res){
  logger.info(`message : service : saveResponse : received request`);
  try {
    console.log("save data service",req.body);
    var responseData = await responseDao.save(req,res);
    return responseData;
  } catch (e) {
    logger.error(`message : service : save Response : Error : ${e}`);
    throw e;
  }


}

var update = async function(req,res){
  logger.info(`message : service : updateResponse : received request`);
  try {
    console.log("update response service",req.body);
    var responseData = await responseDao.update(req,res);
    return responseData;
  } catch (e) {
    logger.error(`message : service : update Response : Error : ${e}`);
    throw e;
  }


}

var get = async function(req,res){
  logger.info(`message : service : get Response : received request`);
  try {
    console.log("get response service",req.body);
    var responseData = await responseDao.get(req,res);
    return responseData;
  } catch (e) {
    logger.error(`message : service : get Response : Error : ${e}`);
    throw e;
  }

}
 
var getAll = async function(req,res){
  logger.info(`message : service : get All Response : received request`);
  try {
    console.log("get All response service",req.body);
    var responseData = await responseDao.getAll(req,res);
    return responseData;
  } catch (e) {
    logger.error(`message : service : get All Response : Error : ${e}`);
    throw e;
  }

}

module.exports.getAll =getAll;
module.exports.update =update;
module.exports.get = get;
module.exports.save = save;