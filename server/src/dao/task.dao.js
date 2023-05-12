/* eslint-disable no-useless-catch */
/* eslint-disable prefer-const */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const taskModel = require('../models/task');
const logger = require('../config/logger');
const notificationDao = require('./notification.dao');
const referralService = require('../services/referral.service');
const referralController = require('../controllers/referral.controller');
const helperService = require('../services/helper.service');
const { taskActionMapPat,taskActionMapCbo } = require('../config/constants');

const create = async (req, res) => {
  logger.info(`task : dao : create : received request`);
  try {
    const response = await taskModel.create({ ...req.body });
    if (req.body.notify && req.body.notify === true) {
      if (
        req.body.senderType.toLowerCase() !== 'patient' &&
        req.body.meta.module
      ) {
        const task = await taskModel
          .findOne({ _id: response._id })
          .populate('senderId')
          .populate('actorId');
        if (task && req.body.senderId !== req.body.actorId) {
          const notification = {};
          notification.type = `referral_task_${req.body.actorType.toLowerCase()}`;
          notification.sender = {
            id: task.senderId.uuid ? task.senderId.uuid : '',
            type: req.body.senderType,
          };

          if (req.body.actorType.toLowerCase() === 'patient') {
            notification.receiver = [
              {
                id: task.actorId.sid ? task.actorId.sid : '',
                type: req.body.actorType,
              },
            ];
          } else {
            notification.receiver = [
              {
                id: task.actorId.uuid ? task.actorId.uuid : '',
                type: req.body.actorType,
              },
            ];
          }
          notification.meta = {
            module: req.body.meta.module,
            moduleId: req.body.meta.moduleId,
            assignedTo: notification.receiver[0].id,
            onBehalfOf: '',
            performer: notification.sender.id,
            documentName: task._doc.title,
            subModule: 'Task',
            subModuleId: response._id,
            auditType: 'Task',
            entity: 'Task',
            type: 'referral_task_created',
          };

          const nReq = {};
          nReq.body = notification;
          notificationDao.callback(nReq, res);
        }
      }
    }
    return response;
  } catch (e) {
    logger.error(`task : dao : create : Error : ${e}`);
    throw e;
  }
};

const getTasks = async (req, res) => {
  logger.info(`task : dao : getTasks : received request`);
  try {
    // const data = req.body;
    // let { page, limit } = data;

    let page  = (req.query.page)?parseInt(req.query.page):1;
     let limit  = (req.query.limit)?parseInt(req.query.limit):10;
    let response = [];
    let total = 0;
    const query = {};
    const users = await helperService.getUserDetails({'_id':req.params.id});
    if(req.query && req.query.moduleId){
     query['meta.moduleId'] = req.query.moduleId;
     let role = (users.role.role)?users.role.role.toLowerCase():"";
     if(role == 'cbo' || role == 'cbo-organization'){
      query['$or'] = [
        { senderType: {"$in": ["Cbo","cbo","cbo-organization"]}},
        { actorType: {"$in": ["Cbo","cbo","cbo-organization"]}},
      ];
     }
     else if(role == 'chw'){
         query['$or'] = [
        { senderType: {"$in": ["Chw","chw"]}},
        { actorType: {"$in": ["Chw","chw"]}},
      ];
     }
     else if(role == 'patient'){
      query['$or'] = [
        { senderType: {"$in": ["Patient","patient"]}},
        { actorType: {"$in": ["Patient","patient"]}},
      ];
     }
    
    }
    else{
    query['$or'] = [
      { senderId: mongoose.Types.ObjectId(req.params.id) },
      { actorId: mongoose.Types.ObjectId(req.params.id) },
    ];
  
    if(users && users.adminId){
      let adminId = users.adminId._id;
      query['$or'] = [
        { senderId: {"$in": [mongoose.Types.ObjectId(req.params.id),mongoose.Types.ObjectId(adminId)]}},
        { actorId: {"$in": [mongoose.Types.ObjectId(req.params.id),mongoose.Types.ObjectId(adminId)]}},
      ];
    }

    }

    // if(page){
    const skip = page ? (Number(page) - 1) * limit : 0;
    
    // if (req.query && req.query.moduleId) {
    //   query['meta.moduleId'] = req.query.moduleId;
  
    // }

     if(Object.keys(query).length == 0){
      return { data: [], count: 0 };
     }
     response = await taskModel
      .find(query)
      .populate('senderId')
      .populate('actorId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
     total = await taskModel.find(query).count();
    // } else {
    //   response = await taskModel.find(query).limit(5).sort({ updatedAt: -1 });
    // }
    
    return { data: response, count: total };
  } catch (e) {
    logger.error(`task : dao : getTasks : Error : ${e}`);
    throw e;
  }
};
 
const checkTaskAutomation = async (task, reqObj, res) => {
  if (reqObj && Object.keys(reqObj).length > 0 && task.meta && task.meta.action && taskActionMapPat[task.meta.action]) {
    if (reqObj.body.meta.status === 'Complete' && reqObj.body.sender.type.toLowerCase() === 'patient') {
      delete reqObj.body.meta.documentName;
      delete reqObj.body.meta.status;
      delete reqObj.body.meta.type;
      delete reqObj.body.meta.subModule;
      delete reqObj.body.meta.subModuleId;
      //reqObj.body.sender = reqObj.body.receiver;
      //reqObj.body.meta.performer = reqObj.body.meta.assignedTo;
      reqObj.body.meta.isSelfTask = true;
      reqObj.body.type = taskActionMapPat[task.meta.action];
      reqObj.body.meta.type = taskActionMapPat[task.meta.action];
      // if(reqObj.body.type == 'review_upload' || reqObj.body.type == 'review_screener' || reqObj.body.type ==  'review_followup'){
      //   reqObj.body.type = reqObj.body.type+"_"+reqObj.body.receiver[0].type;
      // }
      notificationDao.callback(reqObj, res);
    }
  }
  if (task.meta && task.meta.action && taskActionMapCbo[task.meta.action]) {
    
    if (task.status === 'Complete' && ((task.senderType.toLowerCase() === 'cbo')|| (task.senderType.toLowerCase() === 'cbo-organization'))) {
      let refReq = {'params':{'id':task.meta.moduleId},"decoded":task.updatedByData};
      const responses = await referralService.getReferral(refReq, res);
    const helperRes = await helperService.convertReferralFhirToSimpleJson(responses.data);
    const syncedData = await helperService.syncStatus([helperRes]);
    let data = (syncedData.length >0)?syncedData[0]:{};
    if(Object.keys(data).length !== 0){
      data.fs_status = taskActionMapCbo[task.meta.action];
      data.autmatedTask = true;
      let updateReq = {};
      updateReq['params'] = {'id':data._id};
      updateReq['body'] =  data;
       
      const users = await helperService.getUserDetails({'_id':task.senderId.toString()});
      var userInformation=JSON.parse(JSON.stringify(users));
      updateReq.decoded={...userInformation};
      console.log("referral update data",updateReq);
      updateReq.body.updatedByData = (task.updatedByData)?task.updatedByData:{};
      referralController.statusUpdate(updateReq,{});
    }
    

    }
  
  }
  
};

const update = async (req, res) => {
  logger.info(`task : dao : update : received request`);
  try {
    const id = req.params.id;
    const data = req.body;
    const response = await taskModel.findByIdAndUpdate(id, data, { new: true });
   
    let updatedUserData  = req.decoded;
     response.updatedByData = updatedUserData;
    if (req.body.notify && req.body.notify === true) {
      // if (response.updatedBy.toString() === response.actorId.toString()) {
      
      let notifiedUserId = (response.notifiedUserId)?response.notifiedUserId:"";
      let notifiedUserType = (response.notifiedUserType)?response.notifiedUserType:"";
      
      let task= {};
      if(notifiedUserId !="" && notifiedUserType != ""){

       task = await taskModel
        .findOne({ _id: response._id })
        .populate('senderId')
        .populate('actorId')
        .populate('notifiedUserId');
        
        response.senderId = notifiedUserId;
        task.senderId = task.notifiedUserId;
        response.senderType = notifiedUserType;
        task.senderType = notifiedUserType;
      }
      else{
       task = await taskModel
        .findOne({ _id: response._id })
        .populate('senderId')
        .populate('actorId');
      }

      if (
        task &&
        response.senderId.toString() !== response.actorId.toString()
      ) {
        const notification = {};
          
           let senderid = "";
           let actorType = "";
           let senderType = "";
           let receiverId = "";

           if (response.actorType.toLowerCase() === 'patient') {
            senderid = task.actorId.sid ? task.actorId.sid : '';
            actorType = "Patient";
           }
           else{
           senderid = task.actorId.uuid ? task.actorId.uuid : '';
           actorType = response.actorType;
           }

          if (response.senderType.toLowerCase() === 'patient') {
            receiverId = task.senderId.sid ? task.senderId.sid : '';
            senderType = "Patient";
           }
           else{
           receiverId = task.senderId.uuid ? task.senderId.uuid : '';
           senderType = response.senderType;
           }


          if (response.updatedBy.toString() === response.actorId.toString()) {
            notification.sender = {
              id: senderid,
              type: actorType,
            };

            notification.receiver = [
              {
                id: receiverId ,
                type: senderType,
              },
            ];     
     

          }
          else{
          
          notification.sender = {
              id: receiverId,
              type: senderType,
            };

           notification.receiver = [
              {
                id: senderid ,
                type: actorType,
              },
            ];


          }
        notification.type = `referral_task_status_${notification.receiver[0].type.toLowerCase()}`;

        notification.meta = {
          module: response.meta.module,
          moduleId: response.meta.moduleId,
          assignedTo: notification.receiver[0].id,
          onBehalfOf: '',
          performer: notification.sender.id,
          documentName: task.title,
          status: response.status,
          subModule: 'Task',
          subModuleId: id,
          auditType: 'Task',
          entity: 'Task',
          type: 'referral_task_status_update',
        };

        if(response.meta.formId){
          notification.meta.formId = response.meta.formId;
        }

        if(response.meta.responseId){
          notification.meta.responseId = response.meta.responseId;
        }

        console.log("task._doc.isAutomate",task._doc.isAutomate);
        if (task._doc.isAutomate == true) {
          console.log("comes under automate");
          notification.meta.type = "automate_task_status_update";
        }

        const nReq = {};
        console.log("notification",notification);
        nReq.body = notification;
        if(response.isAutomate  && actorType.toLowerCase() === 'patient'){
          //notificationDao.callback(nReq, res);
        }else{
          notificationDao.callback(nReq, res);
        }
       
        let reqObj = JSON.parse(JSON.stringify(nReq));
        checkTaskAutomation(response, reqObj, res);
      }
      else{
        checkTaskAutomation(response, {}, res);
      }

      // }
    }
    return response;
  } catch (e) {
    logger.error(`task : dao : update : Error : ${e}`);
    throw e;
  }
};
 
const findOneAndUpdate  = async (query, data) => {
  try{
    const resp = await taskModel.findOneAndUpdate(query, data);
   return resp;
  
  }catch(e){
throw e;
}
}

module.exports.findOneAndUpdate = findOneAndUpdate;
module.exports.update = update;
module.exports.create = create;
module.exports.getTasks = getTasks;
