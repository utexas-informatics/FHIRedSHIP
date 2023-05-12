/* eslint-disable prefer-destructuring */
var logger = require('../config/logger');
const mongoose = require('mongoose');
const responseModel = require('../models/response');
const taskModel = require('../models/task');
const templateModel = require('../models/template');
var constants = require('../config/constants');
var helperService = require('../services/helper.service');
let userService = require('../services/user.service');
const save = async (req,res) => {
  logger.info(`Response : dao : Save Response : received request`);
  try {
    console.log("save data dao",req.body);
    const response = await responseModel.create({ ...req.body });
    if (response && response!=null) {
      return response;
    }
    throw new Error(`response not saved`);
  } catch (e) {
    logger.error(`Response : dao : Save : Error : ${e}`);
    throw e;
  } 
};

const update = async (req,res) => {
  logger.info(`Response : dao : Update Response  : received request`);
  try {
    let id = req.body._id;
    let formData = req.body;
    delete formData._id;
    const response = await responseModel.findByIdAndUpdate(id, formData, { new: true });
    const template = await templateModel.findOne({"_id":formData.templateId});
     let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
     let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role:userDataSet.role.role;

    var sender = {
      role : (userDataSet.role._doc)?userDataSet.role._doc.role:userDataSet.role.role,
      id : (userRole == 'Chw' || userRole == 'Cbo') ?userDataSet.uuid : userDataSet.sid
    };
    var receiver = {};
    var onBehalfOf = {};
    var moduleName = (formData.moduleId)?"Referral":"Form Response";
    var moduleId = (formData.moduleId)?formData.moduleId:id;
    var documentName = template._doc.name;
    var subModuleName = (formData.moduleId)?"Form Response":"";
    var subModuleId = (formData.moduleId)?id:"";
    var auditType = "Form Response";
    var entity = "Form Response";
    var type = "form_response_update";
    var notificationMeta =  await helperService.returnNotificationJson("form_response_update",sender,receiver,onBehalfOf,moduleName,moduleId,documentName,id,subModuleName,subModuleId,auditType,entity,type)
    var performer = {
      "firstName":userDataSet.firstName,
      "lastName":userDataSet.lastName,
      "email":userDataSet.email
    }
    notificationMeta.data = formData.data;
    var msgContext = await helperService.createMetaObjWithUserName(notificationMeta.meta,performer,{},{});
    let auditResp =  await helperService.saveAuditData(req,notificationMeta.meta,userDataSet._id.toString(),userRole,msgContext);

    if (response && response!=null) {
      return response;
    }
    throw new Error(`response not update`);
  } catch (e) {
    logger.error(`Response : dao : Update : Error : ${e}`);
    throw e;
  } 
};
 
const get = async (req,res) => {
  logger.info(`Response : dao : get Response : received request`);
  try {
    let id = req.params.id;
    const response = await responseModel.findOne({_id:mongoose.Types.ObjectId(id)}).populate('templateId').populate('submittedBy');
    const taskData = await taskModel.findOne({"meta.taskEventId":id,"status":{$ne:constants.taskCompleteStatus}});
    if (response && response!=null) {
      // if (response.templateId.name === 'Personal Information Screener') {
      //   if (!response.data || Object.keys(response.data).length === 0) {
      //     let obj = {emailId: response.submittedBy.email};
      //     const resPatient = await userService.getPatientFHIRInfo(obj);
           
      //     if (resPatient) {
      //       response.data = {};
      //       if (resPatient.name && resPatient.name.length !== 0) {
      //         let fname = '';
      //         let lname = ''
      //         let mname = '';
      //         lname = resPatient.name[0].family
      //           ? resPatient.name[0].family
      //           : '';
      //         if (resPatient.name[0].given && resPatient.name[0].given.length !== 0) {
      //           if (resPatient.name[0].given.length === 1) {
      //             fname = resPatient.name[0].given[0];
      //           } else {
      //             fname = resPatient.name[0].given[0];
      //             mname = resPatient.name[0].given[1];
      //           }
      //         }
      //         response.data = {"id914":fname,"id918":lname,'id915':mname};
      //       }

      //       if(resPatient.gender){
      //        response.data['id2345'] = resPatient.gender.toLowerCase();
      //       }
  
      //       if(resPatient.birthDate){
      //         response.data['id930'] = resPatient.birthDate;
      //       }
      //     } 

          
      //   }
      // }
      return {status:true,data:response,task:taskData};
    }
    throw new Error(`response not get`);
  } catch (e) {
    logger.error(`Response : dao : Save : Error : ${e}`);
    throw e;
  } 
};

const getAll = async (req,res) => {
  logger.info(`Response : dao : get All Response : received request`);
  try {
    let id = req.params.id;
     let limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = req.query.page ? (Number(req.query.page) - 1) * limit : 0;
    let query = {};
    if(req.query.moduleId && req.query.moduleId !='' && req.query.moduleId != null){
      query['moduleId'] = req.query.moduleId;
    }
    
    if(Object.keys(query).length == 0){
      return { data: [], count: 0 };
    }

    const response = await responseModel.find(query).populate('templateId','name').skip(skip)
      .limit(limit).sort({ updatedAt: -1 });
    const total = await responseModel.find(query).count();
    return { data: response, count: total };
  } catch (e) {
    logger.error(`Response : dao : Save : Error : ${e}`);
    throw e;
  } 
}; 

const getOne = async (data) => {
  logger.info(`Response : dao : getOne : received request`);
  try {
    if(Object.keys(data).length == 0){

    return {};
    }
    else{
         const response = await responseModel.findOne(data);
    console.log("response",response);
    return response;
    }
 
  } catch (e) {
    logger.error(`Response : dao : getOne : Error : ${e}`);
    throw e;
  } 
};

module.exports.getOne = getOne;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.get = get;
module.exports.save = save;