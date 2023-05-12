const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const shareDao = require('../dao/share.dao');

var shareForm = async function(req,res){
  logger.info(`message : service : share form : received request`);
  try {
    console.log("save data service",req.body);
    var responseData = await shareDao.shareForm(req,res);
    return responseData;
  } catch (e) {
    logger.error(`message : service : share form : Error : ${e}`);
    throw e;
  }


}


module.exports.shareForm = shareForm;