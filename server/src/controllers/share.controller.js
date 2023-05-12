const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var shareService = require('../services/share.service');



var shareForm = async function (req, res, next) {
  logger.info(`condition : controller : Share Form : received request`);
  try {
    const responses = await shareService.shareForm(req,res);
    res.status(200).json(responses);
  } catch (e) {
    var error = 'Failed to save response!';
    logger.error(`Response : controller : Share Form : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}





module.exports.shareForm = shareForm;