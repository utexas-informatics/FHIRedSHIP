/* eslint-disable no-unneeded-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
const userModel = require('../models/users');
const roles = require('../models/role');
var logger = require('../config/logger');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
const fetch = require('../config/fetch-wrapper');
const mappingService = require('../services/mapping.service');
const userService = require('../services/user.service'); 
const refModal = require("../models/referral");
const mapModal = require("../models/mapping");
const mongoose = require("mongoose");
const getUserByEmailId = async (req, res) => {
  logger.info(`User : dao : getUserByEmailId : received request`);
  try {
     
     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;

     let check = base64RegExp.test(req.headers.email);
     let email = req.headers.email.toLowerCase();
     
     if(check == true){
     email =  Buffer.from(req.headers.email, 'base64').toString('binary');
     }
     


     //const email = Buffer.from(req.headers.email, 'base64').toString('binary');
    // let email =  Buffer.from(req.headers.email, 'base64').toString('binary');
    // if(email =="" || email  == undefined || email ==null){
    //   email = req.headers.email.toLowerCase();
    // }
    //let email = req.headers.email.toLowerCase();
    const response = await userModel
      .findOne(
        { email: email.toLowerCase() },
        {
          _id: 1,
          sid: 1,
          token: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          uuidLinked: 1,
          role: 1,
          uuid: 1,
          facility: 1,
          organization: 1,
          uuidEnable: 1,
          adminId:1,
          type:1,
          isLocked:1,
          lockCount:1
        }
      )
      .populate('role', 'role').populate('adminId');
    if (response && response != null) {

      let adminData = (response._doc.adminId && response._doc.adminId._doc)?response._doc.adminId._doc:{};
      if(adminData.email){
        delete response._doc.adminId._doc;
       response._doc.subs =  {sub:Buffer.from(adminData._id.toString()).toString('base64'),uuidEnable:adminData.uuidEnable,rs:Buffer.from(adminData.uuid.toString()).toString('base64')};
      }
    

      return response;
    }
    //throw new Error(`User not found`);
  } catch (e) {
    logger.error(`User : dao : getUserByEmailId : Error : ${e}`);
    throw e;
  }
};

const create = async (req, res) => {
  logger.info(`User : dao : create : received request`);
  try {
    const userRole = await roles.find({ role: req.body.role });
    const userDataSet = await userModel.findOne({email:req.body.email.toLowerCase()});

    if(!userDataSet){
    const response = await userModel.create({
      ...req.body,
      keycloakId: req.body.token,
      role: userRole[0]._id,
      createdBy: '',
      updatedBy: '',
      organization: req.body.organization?req.body.organization:'',
    });
    const authHeader = { Authorization: referralAuth };

    // get user name
    let name = '';
    const resPatient = await userService.getPatientFHIRInfo({
      emailId: req.body.email.toLowerCase(),
    });
    if (resPatient) {
      let lastName = '';
      let firstName = '';
      if (resPatient.name && resPatient.name.length !== 0) {
        lastName = resPatient.name[0].family ? resPatient.name[0].family : '';
        if (resPatient.name[0].given && resPatient.name[0].given.length !== 0) {
          if (resPatient.name[0].given.length === 1) {
            firstName = resPatient.name[0].given[0];
          } else {
            firstName = `${resPatient.name[0].given[0]} ${resPatient.name[0].given[1]}`;
          }
        }
        name = `${firstName} ${lastName}`;
      }
    } 
    const refResponse = await fetch.post(
      `${referralUrl}/api/user/link`,
      {
        email: req.body.email.toLowerCase(),
        sid: req.body.sid,
        facility: req.body.facility,
        fhiredAppUserID: req.body.fhiredAppUserID,
        type: req.body.role,
        name: name ? name : '',
        organization:req.body.organization
      },
      authHeader
    );
    if (refResponse) {
      await mappingService.save({
        linkedWith: refResponse._id,
        uid: req.body.sid,
      });
    }
    if (response) {
      return response;
    }
   }
   else{
    return {"status":false,msg:"User already exist with this email"};
   }

    throw new Error(`Failed to add user`);
  } catch (e) {
    logger.error(`User : dao : create : Error : ${e}`);
    throw e;
  }
};

const search = async (req, res) => {
  logger.info(`User : dao : search : received request`);
  try {
    const text = req.query.text;

    const moduleId = req.query.moduleId;


    if(moduleId == "" || moduleId == undefined || moduleId == null || req.query.role == "" || req.query.role == undefined || req.query.role == null || req.query.str == null || req.query.str == "" || req.query.str == undefined){
      return [];
    }

      if(req.decoded.role.role !== req.query.role || req.decoded.role.role.toLowerCase() == 'patient'){
      return [];
    }
    
    let stringData = Buffer.from(req.query.str.toString(),'base64').toString('binary');

   stringData =  stringData.split(",");
   let obj = {};
   for(var a=0; a<stringData.length;a++){
    let splitData = stringData[a].split(":");
    if(splitData[0] && splitData[1]){
      obj[splitData[0]] = splitData[1];
    }
   }

    if(obj.chwId && obj.chwRefId && obj.cboId && obj.cboRefId && obj.patId && obj.patRefId){
     
    

    }
    else{
      return [];
    }

   let refQuery = {refId:moduleId,'chw':obj.chwRefId,'cbo':obj.cboRefId,'patient':obj.patRefId};

    let refData = await refModal.findOne(refQuery);
    if(refData == undefined || refData == null){
     return [];
    }

    let query = {};
    query['$and'] = [];
    let cond = {
      $or: [
        { email: { $regex: text, $options: '$i' } },
        { firstName: { $regex: text, $options: '$i' } },
        { lastName: { $regex: text, $options: '$i' } },
      ],
    };
    query['$and'].push(cond);

    let PatientRole = await roles.find({ role: 'Patient' });
    let ChwRole = await roles.find({ role: 'Chw' });
    let CboRole = await roles.find({ role: 'Cbo' });
    if (req.query.role === 'Cbo' || req.query.role === 'cbo-organization') {
      let cond2 = {
        $or: [{ role: PatientRole,_id:mongoose.Types.ObjectId(obj.patId)}, { role: ChwRole,_id:mongoose.Types.ObjectId(obj.chwId) }, { role: CboRole,organization: mongoose.Types.ObjectId(req.decoded.organization)}],
      };
      query['$and'].push(cond2);
    } else if (req.query.role === 'Chw' || req.query.role === 'chw-organization') {
      let cond2 = { $or: [{ role: PatientRole,_id:mongoose.Types.ObjectId(obj.patId)}, { role: ChwRole,organization:mongoose.Types.ObjectId(req.decoded.organization)}] };
      query['$and'].push(cond2);
    }

    const user = await userModel.find(query).populate('role', 'role');
    return user;
  

  } catch (e) {
    logger.error(`User : dao : search : Error : ${e}`);
    throw e;
  }
};

const getPatients = async (data,req,res) => {
  logger.info(`User : dao : getPatients : received request`);
  try {
       
    let page = (req.query.page)?Number(req.query.page):1;
    let limit = (req.query.limit)?Number(req.query.limit):10;
    let skip = (page-1) * limit;
    if(req.decoded && req.decoded.role && req.decoded.role.role == 'Patient' || req.decoded && req.decoded.role && req.decoded.role.role == 'Cbo' || req.decoded && req.decoded.role && req.decoded.role.role == 'cbo-organization'){
    let resp = {status:false,count:0,data:[],error:"access_denied"};
    return resp;
    }
    else if(req.decoded && req.decoded.organization && req.decoded.organization !== data.organization){
    let resp = {status:false,count:0,data:[],error:"access_denied"};
    return resp;
    }
    else{
    const PatientRole = await roles.find({ role: 'Patient' });
    const user = await userModel.find({ ...data, role: PatientRole },{"_id":1,"createdAt":1,"updatedAt":1,"sid":1,"facility":1,"email":1}).skip(skip).limit(limit);
    const count = await userModel
      .count({ ...data, role: PatientRole })
      let resp = {status:true,count:count,data:user};
    return resp;
    }

  } catch (e) {
    return {status:false,msg:e};
    logger.error(`User : dao : getPatients : Error : ${e}`);
    throw e;
  }
};

const update = async (id, data) => {
  logger.info(`User : dao : update : received request`);
  try {
    const resp = await userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return resp;
  } catch (e) {
    logger.error(`User : dao : update : Error : ${e}`);
    throw e;
  }
};

module.exports.update = update;
module.exports.getPatients = getPatients;
module.exports.search = search;
module.exports.create = create;
module.exports.getUserByEmailId = getUserByEmailId;
