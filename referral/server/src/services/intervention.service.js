const logger = require('../config/logger');

const fetchWrapper = require('../config/fetch-wrapper');

const interventions = require('../models/interventions');



var get = async function (req) {
  logger.info(`interventions : service : get : received request`);

  try {
    var searchParam = req.query.s;
    var query = {};
    if(req.query.s && req.query.s != ""){
    query['$or'] = [{ code: { $regex:searchParam, $options: 'i' } },{ desc: { $regex:searchParam, $options: 'i' } }];

    }
    const response = await interventions.find(query).limit(10);
    return response;
  } catch (e) {
    logger.error(`interventions search : service : get : Error : ${e}`);

    throw e;
  }
};

module.exports.get = get;