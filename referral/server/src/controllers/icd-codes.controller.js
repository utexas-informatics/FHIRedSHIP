var icdCodesService = require('../services/icd-codes.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');


var get = async function (req, res, next) {
  try {
    var icdCodesResponse = await icdCodesService.get(req, res);
    res.json(icdCodesResponse);
  } catch (e) {
    var error = 'Failed to get Icd-codes';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.get = get;