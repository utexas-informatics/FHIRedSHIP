var assessmentService = require('../services/assessment.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');

var getById = async function (req, res, next) {
  try {
    var assessment = await assessmentService.getById(req, res,next,'');
    res.json(assessment);
  } catch (e) {
    var error = 'Failed to get assessment';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var get = async function (req, res, next) {
  try {
    var assessment = await assessmentService.get(req, res);
    res.json(assessment);
  } catch (e) {
    var error = 'Failed to get assessment';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.getById = getById;
module.exports.get = get;