const fetchWrapper = require('../config/fetch-wrapper');
const logger = require('../config/logger');
const { coreServicesEndpoints } = require('../config/constants');

var createAudit = async function (auditData) {
  logger.info(`audit : service : createAudit : received request`);
  try {  
    const url = `${process.env.CORE_SERVICES_API_BASE_URL}${coreServicesEndpoints.createAudit}?app=FHIRedSHIP`;
    const response = await fetchWrapper.post(url, auditData);
    return response;
  } catch (e) {
    logger.error(`audit : service : createAudit : Error : ${e}`);
    throw e;
  }
};

var createAuditData = async function (data) {
  logger.info(`audit : service : createAuditInputData : received request`);
  try {  
    let response={};
    return response;
  } catch (e) {
    logger.error(`audit : service : createAuditInputData : Error : ${e}`);
    throw e;
  }
};

var processAuditData = async function (data) {
  logger.info(`audit : service : processAuditData : received request`);
  try {  
    let response={};


    return response;
  } catch (e) {
    logger.error(`audit : service : processAuditData : Error : ${e}`);
    throw e;
  }
};
module.exports.processAuditData = processAuditData;
module.exports.createAuditData = createAuditData;
module.exports.createAudit = createAudit;
