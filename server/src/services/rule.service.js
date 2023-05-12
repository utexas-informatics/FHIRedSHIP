const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const ruleDao = require('../dao/rule.dao');

var get = async function(req,res){
  logger.info(`rule : service : get Response : received request`);
  try {
    var responseData = await ruleDao.get(req,res);
    return responseData;
  } catch (e) {
    logger.error(`rule : service : get Response : Error : ${e}`);
    throw e;
  }

}

module.exports.get = get;