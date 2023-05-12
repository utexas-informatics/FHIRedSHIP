var logger = require('../config/logger');
var ruleModel = require('../models/rules');
var constants = require('../config/constants');
var helperService = require('../services/helper.service');

const get = async (req,res) => {
    logger.info(`Rules : dao : get Rules : received request`);
    try {
      let id = req.params.id;
    const response = await ruleModel.findOne({ templateId: id });
        return response;
    } catch (e) {
      logger.error(`Rules : dao : get : Error : ${e}`);
      throw e;
    } 
  };

module.exports.get = get;