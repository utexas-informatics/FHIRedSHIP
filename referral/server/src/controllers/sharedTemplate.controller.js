var sharedService = require('../services/sharedTemplate.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');

var share = async function (req, res, next) {
  try {
    var shared = await sharedService.share(req, res);
    res.json(shared);
  } catch (e) {
    var error = 'Failed to share';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var get = async function (req, res, next) {
  try {
    var shared = await sharedService.get(req, res);
    res.json(shared);
  } catch (e) {
    var error = 'Failed to get shared data';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var check = async function (req, res, next) {
  try {
    var shared = await sharedService.check(req, res);
    res.json(shared);
  } catch (e) {
    var error = 'template not shared';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};


module.exports.check = check;
module.exports.share = share;
module.exports.get = get;
