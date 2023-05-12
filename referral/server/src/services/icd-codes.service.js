const logger = require('../config/logger');

const fetchWrapper = require('../config/fetch-wrapper');

const icdCodes = require('../models/icd-codes');



var get = async function (req) {
  logger.info(`sharedTemplate : service : get : received request`);

  try {
    var searchParam = req.query.search;
    const response = await icdCodes.find({$or:[{ code: { $regex:searchParam, $options: 'i' } },{ desc: { $regex:searchParam, $options: 'i' } }]});
    return response;
  } catch (e) {
    logger.error(`code search : service : get : Error : ${e}`);

    throw e;
  }
};

module.exports.get = get;