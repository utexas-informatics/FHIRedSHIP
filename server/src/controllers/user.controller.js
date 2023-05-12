const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
const usersModel = require('../models/users');
var userService = require('../services/user.service');


var login = async function (req, res, next) {
  logger.info(`user : controller : login : received request`);
  let finalResponse = {};
  try {
    const response = await userService.login(req, res);
    
    if(response.status == false){
     finalResponse = {"status":false,msg:response.message };
    }
    else{

     const dToken = Buffer.from(
      req.headers.authorization.split('basic ')[1],
      'base64'
    ).toString('binary');
    let email = dToken.substring(0, dToken.indexOf(':'));
    email = email.toLowerCase();
    const user = await usersModel
      .findOne({ email: email })
      .populate({ path: 'role', select: { _id: 1, role: 1 } });
    res.cookie('auth_token', response, {
      maxAge: 900000,
      domain: process.env.DOMAIN,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    finalResponse = response;


    }

   } catch (e) {
    var error = 'Failed to login user';
    logger.error(`user : controller : login : Error : ${e}`);
    
    if (e.message.includes(401)) {
      const dToken = Buffer.from(
        req.headers.authorization.split('basic ')[1],
        'base64'
      ).toString('binary');
      const email = dToken.substring(0, dToken.indexOf(':'));
      email = email.toLowerCase();
      const user = await usersModel
        .findOne({ email: email })
        .populate({ path: 'role', select: { _id: 1, role: 1 } });
       e.message = 'Invalid Email or Password';
       //finalResponse = {"status":false,msg: e.message};
      //res.json({"status":false,msg: e.message});
    }
    
    finalResponse = {"status":false,msg: e.message};

     //res.json({"status":false,msg: e.message});
      //next(errorResponse.build(constants.error.unauthorized, error, e.message));
    // } else {

    //   // res.json({"status":false,msg:"Something went Wrong"});
    //   // next(
    //   //   errorResponse.build(
    //   //     constants.error.internalServerError,
    //   //     error,
    //   //     e.message
    //   //   )
    //   // );
    // }
  }

  res.json(finalResponse);
};


var getRefToken = async function (req,res,next){
  logger.info(`user : controller : getRefToken : received request`);
  try {
    const response = await userService.getRefToken(req, res);
    res.json(response);
  } catch (e) {
    var error = 'Failed to getRefToken';
    logger.error(`user : controller : getRefToken : Error : ${e}`);
    res.json({"status":false,msg:"Something went Wrong"});
}

}

var reset = async function (req, res, next) {
  logger.info(`user : controller : reset : received request`);
  try {
    const response = await userService.reset(req, res);
    res.json(response);
  } catch (e) {
    var error = 'Failed to reset user';
    logger.error(`user : controller : reset : Error : ${e}`);
    res.json({"status":false,msg:"Something went Wrong"});
}
};

var logout = async function (req, res, next) {
  logger.info(`user : controller : logout : received request`);
  try {
    var user = await userService.logout(req, res);
    res.json(user);
  } catch (e) {
    var error = 'Failed to logout User';
    logger.error(`user : controller : logout : Error : ${e}`);
    next(
      errorResponse.build(
        e.toString().includes(401)
          ? constants.error.unauthorized
          : constants.error.internalServerError,
        error,
        e.message
      )
    );
  }
};

var getUserByEmailId = async function (req, res, next) {
  logger.info(`user : controller : getUserByEmailId : received request`);
  try {
    const users = await userService.getUserByEmailId(req, res);
    res.status(200).json(users);
  } catch (e) {
    var error = 'Failed to get user by email id!';
    logger.error(`user : controller : getUserByEmailId : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};


// var linkAccount = async function (req, res, next) {
//   logger.info(`user : controller : linkAccount : received request`);
//   try {
//     const users = await userService.linkAccount(req, res);
//     res.status(200).json(users);
//   } catch (e) {
//     var error = 'Failed to linkAccount!';
//     logger.error(`user : controller : linkAccount : Error : ${e}`);
// next(
//       errorResponse.build(constants.error.internalServerError, error, e.message)
//     );
//   }
// }


var create = async function (req, res, next) {
  logger.info(`user : controller : create : received request`);
  try {
    var response = await userService.create(req, res);
    res.json(response);
  } catch (e) {
    var error = 'Failed to create user';
    logger.error(`user : controller : create : Error : ${e}`);

    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};


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
var getActivity = async function (req, res, next) {
  logger.info(`user : controller : getActivity : received request`);
  try {
    var result = await userService.getActivity(req, res);
    res.json(result);
  } catch (e) {
    var error = 'Failed to get getActivity';
    logger.error(`user : controller : getActivity : Error : ${e}`);
      next(
        errorResponse.build(
          constants.error.internalServerError,
          error,
          e.message
        )
      );
    
  }
};

var search = async function (req, res, next) {
  logger.info(`user : controller : search : received request`);
  try {
    var result = await userService.search(req, res);
    res.json(result);
  } catch (e) {
    var error = 'Failed to get search';
    logger.error(`user : controller : search : Error : ${e}`);
      next(
        errorResponse.build(
          constants.error.internalServerError,
          error,
          e.message
        )
      );
    
  }
};

var getExchangeToken = async function (req, res, next) {
  logger.info(`user : controller : getExchangeToken : received request`);
  try {
    const token = await userService.getExchangeToken(req, res, next);
    res.cookie('auth_token', token, {
      maxAge: 900000,
      domain: process.env.DOMAIN,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    res.status(200).json(token);
  } catch (e) {
    var error = 'Failed to get exchange token!';
    logger.error(`user : controller : getExchangeToken :  Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.getRefToken = getRefToken;
module.exports.search = search;
module.exports.getActivity = getActivity;
module.exports.isAuthenticated = isAuthenticated;
// module.exports.linkAccount = linkAccount;
module.exports.create = create;
module.exports.login = login;
module.exports.reset = reset;
module.exports.logout = logout;
module.exports.getUserByEmailId = getUserByEmailId;
module.exports.getExchangeToken = getExchangeToken;