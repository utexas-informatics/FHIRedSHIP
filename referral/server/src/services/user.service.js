/* eslint-disable consistent-return */
/* eslint-disable no-empty */
/* eslint-disable linebreak-style */
const logger = require('../config/logger');

const fetchWrapper = require('../config/fetch-wrapper');

const users = require('../models/user');
 
const mappings = require('../models/mapping');
const mongoose = require("mongoose");
const orgModal = require("../models/organization");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const AUTH_SECRET_TOKEN = process.env.AUTH_SECRET_TOKEN;
const { v4: uuidv4 } = require('uuid');

var link = async function (req) {
  logger.info(`user : service : login : received request`);

  try {
    let object = { sid: req.body.sid };

    if (req.body.type && req.body.type !== 'Patient') {

    if(req.body.facility == "" || req.body.facility == undefined || req.body.facility == null){
      return {};
    }
      let orgData = await orgModal.findOne({'uuid':req.body.facility});

      if (orgData == undefined || orgData == null){
         return {};
      }

    if(req.user != undefined && req.user != null && req.user != "" && req.user.organization){
  
    if(orgData._id.toString() != req.user.organization){
      return {};
    }
    }
    object = { email: req.body.email.toLowerCase(),organization:mongoose.Types.ObjectId(orgData._id.toString()) };
    }
 
    let user = await users.findOne(object);
    req.body.role = req.body.type;
    if (req.body.type && req.body.type === 'Patient') {
      if (!user) {
        if(req.body && req.body.name){
          req.body.name = "";
        }
        user = await users.create({
          ...req.body,
        });

        await mappings.create({
          sid: req.body.sid,

          url: '',
        });
      }
    } else {
      if (user) {
        const curuuid = req.body.UUID;
        const facility = req.body.facility;
        const userres = await users.findOneAndUpdate(
          {
            email: req.body.email.toLowerCase(),
          },

          {
            $set: {
              uuid: curuuid
            },

            updatedAt: new Date(),
          },

          { new: true }
        );
        return userres;
      }
      else{
        return {};
      }
    }

    return user;
  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);

    throw e;
  }
}; 

var getPatient = async function (req) {
  logger.info(`user : service : getPatient : received request`);

  try {
    let object = { role: 'Patient' };
    // if (req.query && req.query.facility) {
    //   object['facility'] = req.query.facility;
    // }
    if(req.user && req.user.role && req.user.role  == 'Chw'){
      object['organization'] = mongoose.Types.ObjectId(req.user.organization);
    
    const user = await users.find(object,{"email":1,"sid":1,"name":1,"facility":1,"createdAt":1,"_id":1,"updatedAt":1});
    return user;
  }
  else{
    return [];
  }
  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);

    throw e;
  }
};

var searchPatient = async function (req) {
  logger.info(`user : service : getPatient : received request`);

  try {

   if(req.user && req.user.role ){

    if(req.user.role  == 'Chw' || req.user.role  == 'chw-organization'){



    var query = {
       role: 'Patient'
    };
     
    query['organization'] = mongoose.Types.ObjectId(req.user.organization);
    
    if(req.params.email){
    const text = req.params.email.toLowerCase();
    query['$or'] = [{ name: { $regex:text, $options: 'i' } },{ email: { $regex:text, $options: 'i' } }];
    }
    const user = await users.find(query,{ _id: 1, name: 1, email: 1, description: 1,sid:1,uuid:1 });
    return user;
  }
  else{
    return [];
  }
  }
  else{
    return [];
  }
  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);

    throw e;
  }
};

var getRefToken = async function(req){
let email = req.body.email;
const user = await users.findOne({ email: email.toLowerCase() }).populate('adminId');
if(user){
let uuid = '';
if (user.role.toLowerCase() === 'patient') {
 uuid = user.sid;
const token = jwt.sign(
        { user_id: user._id.toString(), uuid: uuid, email:email,organization:user.organization,role:user.role,facility:user.facility},
        AUTH_SECRET_TOKEN,
        {
          expiresIn: '24h',
        }
      );

return {"status":true,token:token,error:""};

}
else{
return {"status":false,token:"",error:"access_denied"};
}
}
else{
  return {"status":false,token:"",error:"access_denied"};
}


}

var login = async function (req) {
  try {
    const dToken = Buffer.from(
      req.headers.authorization.split('basic ')[1],
      'base64'
    ).toString('binary');
    let email = dToken.split(':')[0];
    email = email.toLowerCase();
    const password = dToken.split(':')[1];
    console.log("email",email);
    if (!(email && password)) {
      return { status: false, data: [], msg: 'All input is required' };
    }

    const user = await users.findOne({ email: email.toLowerCase() }).populate('adminId');
    console.log("req.query.type ",req.query.type)
    if(!req.query.type || req.query.type !== 'patient'){
      const userPassword = user.password?user.password:'';
      if(!await bcrypt.compare(password, userPassword)){
        return { status: false, data: [], msg: 'Invalid Credentials' };
      } 
    }
    if (user) {
      // Create token

      let uuid = '';
      if (user.role.toLowerCase() === 'patient') {
        uuid = user.SID;
      } else {
        uuid = user.uuid;
      }

      const token = jwt.sign(
        { user_id: user._id.toString(), uuid: uuid, email:email,organization:user.organization,role:user.role,facility:user.facility},
        AUTH_SECRET_TOKEN,
        {
          expiresIn: '24h',
        }
      );


      var newuser = {};
      user.token = token;
      newuser['email'] = user.email.toLowerCase();
      newuser['uuid'] = user.uuid;
      newuser['token'] = token;
      newuser['facility'] = user.facility;
      newuser['role'] = user.role;
      newuser['_id'] = user._id;
      newuser['name'] = user.name;
      newuser['type'] = user.type;
      newuser['organization'] = user.organization;
      newuser['adminId'] = user.adminId?user.adminId:'';
      
      if(user.adminId && user.adminId.email){
      let adminData = user.adminId;
      newuser.adminId = {};
      newuser.subs = {sub:Buffer.from(adminData._id.toString()).toString('base64')};
      }
      // save user token

      return { status: true, data: newuser, msg: '' };
    }
    return { status: false, data: [], msg: 'Invalid Credentials' };
  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);
    return { status: false, data: [], msg: e};
    //throw e;
  }
};

var getToken = async function (req) {
  try {
    const dToken = Buffer.from(
      req.headers.authorization.split('basic ')[1],
      'base64'
    ).toString('binary');
    let email = dToken.split(':')[0];
    email = email.toLowerCase();
    const password = dToken.split(':')[1];

    if (!(email)) {
      res.status(400).send('All input is required');
    }

    const user = await users.findOne({ email: email.toLowerCase() });

    if (user) {
      let uuid = '';
      if (user.role === 'patient' || user.role === 'Patient') {
        uuid = user.sid;
      } else {
        uuid = user.uuid;
      }

      const token = jwt.sign(
        { user_id: user._id, uuid: uuid, email },
        AUTH_SECRET_TOKEN,
        {
          expiresIn: '24h',
        }
      );
      var newuser = {};
      user.token = token;
      newuser['email'] = user.email.toLowerCase();
      newuser['uuid'] = user.uuid;
      newuser['token'] = token;
      newuser['facility'] = user.facility;
      newuser['role'] = user.role;
      newuser['_id'] = user._id;
      newuser['name'] = user.name;
      // save user token

      return { status: true, data: newuser, msg: '' };
    }
    return { status: false, data: [], msg: 'Invalid Credentials' };
  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);
    throw e;
  }
};
var generatePassword = async function (req, res, next) {
  logger.info(`user : controller : login : received request`);
  try {
    return await bcrypt.hash(req.body.password, 10);
  } catch (e) {}
};

var getUser = async function (userObject) {
  logger.info(`user : service : getUser : received request`);
  

  try {
    if(Object.keys(userObject).length == 0){
     return {};
    }
    else{
    const user = await users.findOne(userObject);
    return user;
    }

  } catch (e) {
    logger.error(`user : service : getUser : Error : ${e}`);

    throw e;
  }
};

var searchUsers = async function (req, type) {
  logger.info(`user : service : getUsers : received request`);
  let text = "";
  if(req.params.text){
     text = req.params.text;
  }
  else if(req.query.s){
    text = req.query.s;
  }
  

  try {
    let object = {
      role: 'Patient',
      /*      email: { $regex: text, $options: '$i' },
      name: { $regex: text, $options: '$i' },*/
    };
    object['$or'] = [];

    let projection = { _id: 1, name: 1, email: 1, description: 1,sid:1,uuid:1 };

    if (type == 'cbo' || type == 'Cbo') {
      object = {
        role: 'cbo-organization'
        /*      description: { $regex: text, $options: '$i' },
      name: { $regex: text, $options: '$i' },*/
      };
      object['$or'] = [
        { name: { $regex: text, $options: '$i' } },
        { description: { $regex: text, $options: '$i' } },
      ];
        const user = await users.find(object, projection);
        return user; 

    } else if(type == 'Patient' || type == 'patient') {
      if(req.user && req.user.organization != "" && req.user.organization != undefined && req.user.organization != null){
         object['$or'] = [
        { name: { $regex: text, $options: '$i' },organization:req.user.organization},
        { email: { $regex: text, $options: '$i' },organization:req.user.organization },
      ];
     
         const user = await users.find(object, projection);
         return user; 

      }
      else{
       return [];
      }
      // object['$or'] = [
      //   { name: { $regex: text, $options: '$i' } },
      //   { email: { $regex: text, $options: '$i' } },
      // ];
    }
   return [];

  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);
    throw e;
  }
};
module.exports.getRefToken = getRefToken;
module.exports.searchUsers = searchUsers;
module.exports.getUser = getUser;
module.exports.link = link;
module.exports.getToken = getToken;
module.exports.login = login;
module.exports.generatePassword = generatePassword;
module.exports.getPatient = getPatient;
module.exports.searchPatient = searchPatient;
