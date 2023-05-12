const fetchWrapper = require('./config/fetch-wrapper');
const userService = require('./services/user.service');
const roles = require('./models/role');

var verifyToken = async function (req, res,next) {
  //logger.info(`user : service : logout : received request`);
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.includes('bearer ')
    ) {
      const userInfo = await fetchWrapper.get(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/getUserInfoByToken`,
        { authorization: req.headers.authorization }
      );
      if (userInfo && userInfo.error) {
        res.send({status:false,data:[],msg:'Invalid Token'});
      } else {
        if(req.decoded){
        }else{
          req.decoded={}
        }
         req.headers.email=userInfo.email;
        const users = await userService.getUserByEmailId(req, res);
        var userInformation=JSON.parse(JSON.stringify(users));
        req.decoded={...userInformation};
       

        //req.decoded={...users};
        next();
        //res.send({status:true,data:[],msg:''});
      }
    }
    else{
      res.status(401).json({status:false,data:[],msg:'Invalid Token'});
    }
    //res.send({status:false,data:[],msg:'Invalid Token'});
    // logger.error(
    //   `user : service : getUserInfoByToken : Authorization token not found`
    // );
  } catch (e) {
   // logger.error(`user : service : logout : Error : ${e}`);
    throw e;
  }
};


var checkEmailWithToken = async function(email,matchEmail){
if(email === matchEmail){
  return true;
}
else{
  return false;
}

}


var authorization = async function (req, res,next) {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.includes('bearer')
    ) {
      let errorMsg = "";
      let isAuthneticated = true;
      const userInfo = await fetchWrapper.get(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/getUserInfoByToken`,
        { authorization: req.headers.authorization }
      );
      
      if (userInfo && userInfo.error) {
        res.send({status:false,data:[],msg:'Invalid Token'});
       } else {
        
        if(req.decoded){
        }else{
          req.decoded={}
        }

        if((req.headers.email && req.headers.email !== "") || (req.query.email && req.query.email !== "")){
         let email = req.headers.email;
         if(email && email == ''){
          email = req.query.email;
         }
        isAuthneticated = await checkEmailWithToken(req.headers.email,userInfo.email);
        errorMsg = 'You don’t have access to this page or your session has expired';
        }

        if(isAuthneticated ==false){
         res.status(403).json({status:false,data:[],msg:errorMsg});
        }
        else{
            next();
        }
       
      
      }
    }
    else{
      res.status(401).json({status:false,data:[],msg:'Invalid Token'});
    }
  } catch (e) {
    throw e;
  }
};



var validateRoleWithToken = async function(req, res, next){
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.includes('bearer ')
    ) {
      let errorMsg = "";
      let isAuthneticated = true;
       let role = (req.headers && req.headers.userRole && req.headers.userRole !== "")?req.headers.userRole:"";
        if(role ==""){
          role = (req.headers.userrole)?req.headers.userrole:"";
        }

        let userId = (req.headers && req.headers.userId && req.headers.userId !== "")?req.headers.userId:"";
        
         if(userId ==""){
          userId = (req.headers.userid)?req.headers.userid:"";
        }
      // if(role == "" || role == undefined){
      //  next();
      // }
      // else{
      const userInfo = await fetchWrapper.get(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/getUserInfoByToken`,
        { authorization: req.headers.authorization }
      );
      if (userInfo && userInfo.error) {
        res.send({status:false,data:[],msg:'Invalid Token'});
      } else {
         
         req.headers.email = userInfo.email;
        const users = await userService.getUserByEmailId(req, res);
        var userInformation=JSON.parse(JSON.stringify(users));
        if(role != "" && role != undefined && role != null){
         let PatientRole = await roles.findOne({ role: role });

        if(PatientRole._id.toString() !== userInformation.role._id){
         isAuthneticated = false;
         errorMsg = "You don’t have access to this page or your session has expired";
        }
        }
       
        if(userId != "" && userId != undefined && userId != null){

        if(userId.toString() !== userInformation._id.toString()){
         isAuthneticated = false;
         errorMsg = "You don’t have access to this page or your session has expired";
        }
        }

      
      }

      if(isAuthneticated == false){
      res.status(403).json({status:false,data:[],msg:errorMsg});
      }
      else{
        if(req.decoded){
        }else{
          req.decoded={}
        }
        req.decoded={...userInformation};

        next();
      }

    // }

 
    }
    else{
      res.status(401).json({status:false,data:[],msg:'Invalid Token'});
    }

  } catch (e) {
    throw e;
  }



}


var verifyApi = async function (req, res, next) {
  //logger.info(`user : service : logout : received request`);
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.includes('bearer ')
    ) {
      const userInfo = await fetchWrapper.get(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/getUserInfoByToken`,
        { authorization: req.headers.authorization }
      );
      if (userInfo && userInfo.error) {
        res.send({status:false,data:[],msg:'Invalid Token'});
      } else {
        if(req.decoded){
        }else{
          req.decoded={}
        } 
         req.headers.email=userInfo.email;
        const users = await userService.getUserByEmailId(req, res);
        var userInformation=JSON.parse(JSON.stringify(users));
        req.decoded={...userInformation};
        //req.decoded={...users};
        next();
        //res.send({status:true,data:[],msg:''});
      }
    }
    else{
      res.status(401).json({status:false,data:[],msg:'Invalid Token'});
    }
    //res.send({status:false,data:[],msg:'Invalid Token'});
    // logger.error(
    //   `user : service : getUserInfoByToken : Authorization token not found`
    // );
  } catch (e) {
   // logger.error(`user : service : logout : Error : ${e}`);
    throw e;
  }
};
module.exports.validateRoleWithToken = validateRoleWithToken;
module.exports.authorization = authorization;
module.exports.verifyApi = verifyApi;
module.exports.verifyToken = verifyToken;