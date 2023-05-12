const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const organizationsDao = require('../dao/organization.dao');

var getOrganization = async function(data){
  logger.info(`message : service : getByRoomId : received request`);
  try {
    var orgData = await organizationsDao.getOrganization(data);
    return orgData;
  } catch (e) {
    logger.error(`message : service : getByRoomId : Error : ${e}`);
    throw e;
  }


}


module.exports.getOrganization = getOrganization;