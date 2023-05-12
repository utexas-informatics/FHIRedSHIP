var interventionService = require('../services/intervention.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');


var get = async function (req, res, next) {
  try {
    var interventionsResponse = await interventionService.get(req, res);
    res.json(interventionsResponse);
  } catch (e) {
    var error = 'Failed to get interventions';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.get = get;