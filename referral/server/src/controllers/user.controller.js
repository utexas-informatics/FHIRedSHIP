var userService = require('../services/user.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');
const logger = require('../config/logger');

var link = async function (req, res, next) {
  try {
    var user = await userService.link(req, res);
    res.json(user);
  } catch (e) {
    var error = 'Failed to get User';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getRefToken = async function (req,res,next){
    try {
    var user = await userService.getRefToken(req, res);
    res.json(user);
  } catch (e) {
    var error = 'Failed to getRefToken';
  };
}

var getDetails = async function(req,res,next){
    try {
       var newuser = {};
      newuser['email'] = req.user.email.toLowerCase();
      newuser['uuid'] = req.user.uuid;
      newuser['token'] = req.user.token;
      newuser['facility'] = req.user.facility;
      newuser['role'] = req.user.role;
      newuser['_id'] = req.user.user_id;
      newuser['name'] = req.user.name;
      newuser['type'] = req.user.type;
      newuser['organization'] = req.user.organization;
      newuser['adminId'] = req.user.adminId?req.user.adminId:'';
    res.send({status:true,data:newuser});
  } catch (e) {
    var error = 'Failed to getRefToken';
    res.send({status:false,data:{},msg:"access_denied"});
  };


}

var getPatient = async function (req, res, next) {
  try {
    var user = await userService.getPatient(req, res);
    res.json(user);
  } catch (e) {
    var error = 'Failed to get User';
  };
}

var login = async function (req, res, next) {
  logger.info(`user : controller : login : received request`);
  try {
    const response = await userService.login(req, res);
     res.json(response);
}catch (e) {
    var error = 'Failed to login';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getToken = async function (req, res, next) {
  logger.info(`user : controller : getToken : received request`);
  try {
    const response = await userService.getToken(req, res);
     res.json(response);
}catch (e) {
    var error = 'Failed to getToken';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var searchPatient = async function (req, res, next) {
  try {
    var user = await userService.searchPatient(req, res);
    res.json(user);
  } catch (e) {
    var error = 'Failed to get User';
  }
}

var isAuthenticated = async function (req, res, next) {
  logger.info(`user : controller : login : received request`);
  try {
     res.json({status:true,data:[],msg:''});
   }catch (e) {
    var error = 'Failed to login';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};



var generatePassword = async function (req, res, next) {
  logger.info(`user : controller : generatePassword : received request`);
  try {
    const response = await userService.generatePassword(req, res);
    res.send({data:response});
}catch (e) {
    var error = 'Failed to generate password';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var searchCbos = async function (req, res) {
  try {
    var user = await userService.searchUsers(req, 'Cbo');
    res.json(user);
  } catch (e) {
    var error = 'Failed to get User';
  }
}

var searchPatients = async function (req, res, next) {
  try {
    var user = await userService.searchUsers(req, 'Patient');
    res.json(user);
  } catch (e) {
    var error = 'Failed to get User';
  }
}
module.exports.getDetails = getDetails;
module.exports.getRefToken = getRefToken;
module.exports.searchCbos = searchCbos;
module.exports.searchPatients = searchPatients;
module.exports.getPatient = getPatient;
module.exports.searchPatient = searchPatient;
module.exports.isAuthenticated = isAuthenticated;
module.exports.login = login;
module.exports.getToken = getToken;
module.exports.link = link;
module.exports.generatePassword = generatePassword;
