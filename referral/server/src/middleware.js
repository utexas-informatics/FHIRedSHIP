const jwt = require("jsonwebtoken");
const AUTH_SECRET_TOKEN = process.env.AUTH_SECRET_TOKEN;
const userModal = require("./models/user");
var fsAuth = process.env.FS_AUTH;


const verifyToken = async (req, res, next) => {
  if(req.headers.authorization && req.headers.authorization.split('bearer')[1]){
  const token =req.headers.authorization.split('bearer')[1];
   if (!token) {
    return res.send({status:false,data:[],msg:"A token is required for authentication"});
  }
try {
    const decoded = jwt.verify(token.trim(), AUTH_SECRET_TOKEN);
    let userData = await userModal.findOne({"email":decoded.email.trim()});
      let errorMsg = "";
      let isAuthneticated = true;

      let role = (req.headers && req.headers.userrole && req.headers.userrole !== "")?req.headers.userrole:"";
      let userid = (req.headers && req.headers.userid && req.headers.userid !== "")?req.headers.userid:"";
    

    // if(req.headers.userrole && req.headers.userrole != "" && req.headers.userrole != undefined){
    if(role && role != "" && role != undefined && role != null){
    if(userData.role !== role){
        isAuthneticated = false;
        errorMsg = "You don’t have access to this page or your session has expired";
    }
    }

    if(userid && userid != "" && userid != undefined && userid != null){
    if(userid.toString() !== userData._id.toString()){
     isAuthneticated = false;
        errorMsg = "You don’t have access to this page or your session has expired";
    }

    }
     
    if(isAuthneticated == false){
    res.status(403).json({status:false,data:[],msg:errorMsg});
    }
    else{
      req.user = decoded;
       return next();  
    }

    // if(userData.role == req.headers.userrole){
    // req.user = decoded;
    // return next();
    // }
    // else{
    //    res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
    // }

    // }
    // else{

    // req.user = decoded;
    // return next();

    // }

    } catch (err) {
    //return res.json({status:false,data:[],msg:'Invalid Token'});
    return res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
   }
   
  }

  else if(req.headers.authorization && req.headers.authorization.split('Basic')[1]){
  if(req.headers.authorization === fsAuth){
     return next();
  }
  

  }
  else{
      return res.send({status:false,data:[],msg:"A token is required for authentication"});
  }   
 
};



// const tokenRoleValidate = (req, res, next) => {
//   if(req.headers.authorization && req.headers.authorization.split('bearer')[1]){
//   req.headers.authorization.split('bearer')[1]
//   const token =req.headers.authorization.split('bearer')[1];
//    if (!token) {
//     return res.send({status:false,data:[],msg:"A token is required for authentication"});
//   }
//   try {
//     const decoded = jwt.verify(token.trim(), AUTH_SECRET_TOKEN);
//     req.user = decoded;
    
    

//    } catch (err) {
//     //return res.json({status:false,data:[],msg:'Invalid Token'});
//     return res.send({status:false,data:[],msg:'Invalid Token'});
//   }
//   }
//   else{
//       return res.send({status:false,data:[],msg:"A token is required for authentication"});
//   }   
//   return next();
// };

// module.exports.tokenRoleValidate = tokenRoleValidate;
module.exports.verifyToken = verifyToken;