/* eslint-disable object-shorthand */
/* eslint-disable import/order */
/* eslint-disable prefer-template */
/* eslint-disable arrow-body-style */
/* eslint-disable dot-notation */
const mappings = require('../models/mapping');
const logger = require('../config/logger');

var save = async function (data) {
  logger.info(
    `mapping : dao  : save : received request` + JSON.stringify(data)
  );
  try {
    let mappedData = await  mappings.findOne({ linkedWith: data.linkedWith });
    let mapping = '';
    if (mappedData) {
      mapping = await mappings.findByIdAndUpdate(mappedData._id, data, {
        new: true,
      });
    } else {
      mapping = await mappings.create(data);
    }

    if (mapping) {
      return mapping;
    }
    throw new Error(`Error while creating mapping`);
  } catch (e) {
    logger.error(`mapping : dao : save : Error : ${e}`);
    throw e;
  }
};

var getMapping = async function (data) {
  logger.info(
    `mapping : dao  : getMapping : received request` + JSON.stringify(data)
  );
  try {
    if(Object.keys(data).length == 0){
         return {};
    }
    const mapping = await mappings.findOne(data);
    // if (mapping) {
    //   return mapping;
    // }
    return mapping
    //throw new Error(`Error while getting mapping`);
  } catch (e) {
    logger.error(`mapping : dao : getMapping : Error : ${e}`);
    throw e;
  }
};

module.exports.getMapping = getMapping;
module.exports.save = save;
