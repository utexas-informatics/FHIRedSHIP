const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const templateDao = require('../dao/template.dao');

var getFormById = async function(req,res){
  logger.info(`message : service : getFormById : received request`);
  try {
    var formData = await templateDao.getFormById(req,res);
    return formData;
  } catch (e) {
    logger.error(`message : service : getFormById : Error : ${e}`);
    throw e;
  }


}

var getAll = async function(req,res){
  logger.info(`message : service : getAll Forms : received request`);
  try {
    var formData = await templateDao.getAll(req,res);
    return formData;
  } catch (e) {
    logger.error(`message : service : getAll Forms : Error : ${e}`);
    throw e;
  }


}


module.exports.getAll = getAll;
module.exports.getFormById = getFormById;