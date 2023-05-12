const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var referralService = require('../services/referral.service');
var helperService = require('../services/helper.service');
const notificationDao = require('../dao/notification.dao');
const notesModel = require('../models/notes');
const taskModel = require('../models/task');


var getReferrals = async function (req, res, next) {
  logger.info(`referral : controller : getReferrals : received request`);
  try {
    const responses = await referralService.getReferrals(req, res);
    const helperRes = await helperService.convertReferralFhirBundleToSimpleJson(responses.data.data);
    const syncedData = await helperService.syncStatus(helperRes);

    let object={'data':syncedData,'count':responses.data.count}
    res.status(200).json(object);
  } catch (e) {
    var error = 'Failed to getReferrals!';
    logger.error(`referral : controller : getReferrals : Error : ${e}`);
 next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var getReferral = async function (req, res, next) {
  logger.info(`referral : controller : getReferrals : received request`);
  try {
    const responses = await referralService.getReferral(req, res);
    const helperRes = await helperService.convertReferralFhirToSimpleJson(responses.data);
    const syncedData = await helperService.syncStatus([helperRes]);
    let data = (syncedData.length >0)?syncedData[0]:{};
    if(data.chw)
    res.status(200).json(data);
  } catch (e) {
    var error = 'Failed to getReferrals!';
    logger.error(`referral : controller : getReferrals : Error : ${e}`);
next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}


var createNotificationData = async function(notificationType,sender,patReceiver,onBehalfOf,moduleName,moduleId,documentName,documentId,subModuleName,subModuleId,auditType,entity,notificationType){
var notification =  await helperService.returnNotificationJson(notificationType,sender,patReceiver,onBehalfOf,moduleName,moduleId,documentName,documentId,subModuleName,subModuleId,auditType,entity,notificationType);

return notification;

}

  
var statusUpdate = async function (req, res, next) {
  logger.info(`referral : controller : Status Update : received request`);
  try {
    let obj = {};
    obj['id'] = req.params.id;
    obj['data'] = {status:req.body.fs_status,updatedAt:new Date()};
    const responses = await referralService.update(obj, res);

    if(Object.keys(res).length !== 0){
      res.status(200).json({status:true,error:false,data:responses,"msg":""});
    }
   

    let userDataSet = {};

    if(req.decoded._doc){
    userDataSet = req.decoded._doc;
    }
    else{
     userDataSet = req.decoded;
    }
    
    var sender = {
      role : (userDataSet.role._doc)?userDataSet.role._doc.role:userDataSet.role.role,
      id : userDataSet._id
    };
    var receiver = {
    id:req.body.chw.id,
    role:'Chw'
    };
    var onBehalfOf = {
    id:req.body.patient.id,
    role:'Patient'
    }; 
    var moduleName = (req.body.referralName)?req.body.referralName:"Referral";
    var moduleId = (req.body._id)?req.body._id:"";
    var documentName = req.body.referralName;
    var subModuleName = "";
    var subModuleId = "";
    var auditType = "Referral";
    var entity = "Referral";
    var type = "referral_status_update";
    let checkStatusExist = constants.statusListToNotifyPatient.indexOf(req.body.fs_status);
     if(checkStatusExist == -1){
      onBehalfOf = "";
     }

    var notification =  await helperService.returnNotificationJson(type,sender,receiver,onBehalfOf,moduleName,moduleId,documentName,req.body._id,subModuleName,subModuleId,auditType,entity,type);
    const nReq = {};
     notification.meta.status = req.body.fs_status;
     nReq.body = notification;
     
  

    /// if(!req.body.autmatedTask){
      nReq.body.updatedByData = req.body.updatedByData;
      notificationDao.callback(nReq, res);
    // }
     
     let callbackData = {};
     callbackData['id'] = req.params.id;
     callbackData.meta={};
     callbackData.meta.type =  "referral_status_updated";
     callbackData.meta.status =  constants.referralStatusMapping[req.body.fs_status];
     const resp = await referralService.sendCallbackToReferral(callbackData, res);
     
     
     if(req.body.fs_status == 'HHSC Completed' || req.body.fs_status == 'Upload Documents' || req.body.fs_status == 'Schedule Meeting' || req.body.fs_status == 'Fill HHSC'){
     
     let notificationType = req.body.fs_status;
     var patReceiver = {
     id:req.body.patient.id,
     role:'Patient'
     };
     const notificationAutomatedTaskData = await createNotificationData(notificationType,sender,patReceiver,"",moduleName,moduleId,documentName,req.body._id,subModuleName,subModuleId,auditType,entity,notificationType); 
     const notificationReq = {};
     notificationReq.body = notificationAutomatedTaskData;
    //  if(!req.body.autmatedTask){
      notificationReq.body.updatedByData = req.body.updatedByData;
      notificationDao.callback(notificationReq, res);
    // }
    
     }  

  } catch (e) {
    var error = 'Failed to Status Update!';
    logger.error(`referral : controller : Status Update : Error : ${e}`);
     res.status(500).json({status:false,error:e,data:{},msg:"Something went wrong"});
   next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}

var nextstep = async function (req, res, next) {
let taskId = req.body.id;
let task = await taskModel.findOne({"_id":taskId});   
 if (task.status === 'Complete' && task.senderType.toLowerCase() === 'cbo') {
    let refReq = {'params':{'id':task.meta.moduleId}}
    const responses = await referralService.getReferral(refReq, res);
    const helperRes = await helperService.convertReferralFhirToSimpleJson(responses.data);
    const syncedData = await helperService.syncStatus([helperRes]);
    let data = (syncedData.length >0)?syncedData[0]:{};
    if(Object.keys(data).length !== 0){
      if(constants.taskActionMapCbo[task.meta.action]){
          data.fs_status = constants.taskActionMapCbo[task.meta.action];
          data.autmatedTask = true;
      let updateReq = {};
      updateReq['params'] = {'id':data._id};
      updateReq['body'] =  data;
      updateReq.decoded={...req.decoded};
      console.log("referral update data",updateReq);
      statusUpdate(updateReq,res);

      }
      else{
        res.send({"status":false,"msg":""});
      }
   
    }
   
    }
}

module.exports.nextstep = nextstep;
module.exports.statusUpdate = statusUpdate;
module.exports.getReferral = getReferral;
module.exports.getReferrals = getReferrals;