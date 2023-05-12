var logger = require('../config/logger');
const organizations = require('../models/organization');

const getOrganization = async (data) => {
  logger.info(`User : dao : getUserByEmailId : received request`);
  try {
     
     if(Object.keys(data).length == 0){
    return {};
     }
    else{
         const response = await organizations.findOne(data)
    return response;
    }
 
   
  } catch (e) {
    logger.error(`User : dao : getUserByEmailId : Error : ${e}`);
    throw e;
  } 
};


module.exports.getOrganization = getOrganization;