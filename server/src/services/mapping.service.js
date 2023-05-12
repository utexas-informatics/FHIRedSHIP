const logger = require('../config/logger');
const mappingDao = require('../dao/mapping.dao');

var save = async function(data){
  logger.info(`mapping : service : save : received request`);
  try {
    var mapData = await mappingDao.save(data);
    return mapData;
  } catch (e) {
    logger.error(`mapping : service : save : Error : ${e}`);
    throw e;
  }


}

var getMapping = async function (data) {
  logger.info(`mapping : service : getMapping : received request`);
  try {
    var mapData = await mappingDao.getMapping(data);
    return mapData;
  } catch (e) {
    logger.error(`mapping : service : getMapping : Error : ${e}`);
    throw e;
  }


}


module.exports.save = save;
module.exports.getMapping = getMapping;