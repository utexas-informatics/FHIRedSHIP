/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable object-shorthand */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable block-scoped-var */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const moment = require('moment');
const fetchWrapper = require('../config/fetch-wrapper');
const notificationModel = require('../models/notification');
const notificationType = require('../models/notification-type');
const notificationTemp = require('../models/notification-template');
const notificationDel = require('../models/notification-delivery-channel');
const logger = require('../config/logger');
const { createAudit } = require('../services/audit.service');
const { v4: uuidv4 } = require('uuid');

const referralUrl = process.env.REFERRAl_URL;
const referralAuth = process.env.RERERRAL_TOKEN;
const fetch = require('../config/fetch-wrapper');
const notificationService = require('../services/notification.service');
const taskDao = require('./task.dao');
const shareDao = require('./share.dao');
const { domain,shareForm } = require('../config/constants');
const helperService = require('../services/helper.service');
const userService = require('../services/user.service');
const mappingService = require('../services/mapping.service');
const refService = require('../services/referral.service');
const taskTemplateService = require('../services/task-template.service');
const notificationTemplateService = require('../services/notification-template.service');
const roleModel = require("../models/role");
const userModel = require("../models/users");
var constants = require('../config/constants');
var fhirAppUrl = process.env.FHIREDAPP_URL;
const mongoose = require("mongoose");
  
const createNotification = async (req, res) => {
  logger.info(`Notification : dao : create : received request`);
  try {
    const response = await notificationModel.create({ ...req.body });
    return response;
  } catch (e) {
    logger.error(`Notification : dao : create : Error : ${e}`);
    throw e;
  }
};

const getUserDetails = async (query) => {
  var userDetail = await helperService.getUserDetails(query);
  // if(userDetail && userDetail.adminId){
  //   if(Object.keys(userDetail.adminId).length !== 0){
  //     userDetail = userDetail.adminId;
  //   }
  // }
  return userDetail;
};
const createShareData = async(metaInfo, userDetails) => {
  const data = {};
  let reqData = {};
  data['moduleId'] = metaInfo.moduleId;
  data['sharedWith'] = userDetails.onBehalfOf && userDetails.onBehalfOf._id ?userDetails.onBehalfOf._id:'';
  data['forms'] = [shareForm];
  data['sharedBy'] = '';
  data['sharedByType'] = '';
  if(userDetails.acceptedBy && userDetails.acceptedBy._id){
   data['sharedBy'] =userDetails.acceptedBy._id;
   data['sharedByType'] = (userDetails.acceptedBy.role && userDetails.acceptedBy.role.role)?userDetails.acceptedBy.role.role:"";
  }
  else if(userDetails.performer && userDetails.performer._id){
   data['sharedBy'] = userDetails.performer._id;
   data['sharedByType'] = (userDetails.performer.role && userDetails.performer.role.role)?userDetails.performer.role.role:"";
  }
 
  reqData.body = data;
  return reqData;
}
const updateReferral = async (metaInfo, userDetails, res,req,msgContextObject,createdBy,userRole) => {
  let refData = { id: metaInfo.moduleId };
  let acceptedBy = (metaInfo.acceptedByOfRefId)?metaInfo.acceptedByOfRefId:"";
  refData['data'] = { refStatus: metaInfo.status,acceptedBy:acceptedBy};
  if (metaInfo.status.toLowerCase() === 'active') {
    refData['data'].refStatus = 'Screener Requested';
    let data = await createShareData(metaInfo, userDetails);
    shareDao.shareForm(data,res)
  }
  let refResponse = await refService.update(refData,res);
  let taskUpdate = await taskDao.findOneAndUpdate(
    { 'meta.moduleId': metaInfo.moduleId, 'meta.action': 'referral_created' },
    { status: 'Complete' }
  );
  console.log("taskUpdate",taskUpdate);
    let meta = {
          module: "Referral",
          moduleId: metaInfo.moduleId,
          assignedTo: metaInfo.acceptedBy,
          onBehalfOf: '',
          performer: metaInfo.acceptedBy,
          documentName: taskUpdate.title,
          status: "Complete",
          subModule: 'Task',
          subModuleId: taskUpdate._id,
          auditType: 'Task',
          entity: 'Task',
          type: 'referral_task_status_update',
        };
  let msgContext = {
  "acceptedBy":msgContextObject.acceptedBy,
  "acceptedByOfRefId":msgContextObject.acceptedByOfRefId,
  "action":"referral_task_status_update",
  "status":meta.status,
  "module":metaInfo.moduleId,
  "documentName":taskUpdate.title,
  "subModule": 'Task',
  "subModuleId": taskUpdate._id,
  "auditType": 'Task',
  "entity": 'Task',
  "performer":msgContextObject.performer,
  "performerRefId":msgContextObject.performerRefId
}
let auditResponse = await helperService.saveAuditData(
      req,
      meta,
      createdBy,
      userRole,
      msgContext
    );

  return { status: true };
};

const saveReferral = async (metaInfo) => {
  const cboMapping = await mappingService.getMapping({
    uid: metaInfo.assignedTo,
  });
  const chwMapping = await mappingService.getMapping({
    uid: metaInfo.performer,
  }); 
  const patMapping = await mappingService.getMapping({
    uid: metaInfo.onBehalfOf,
  });
  const refData = {
    cbo: cboMapping && cboMapping.linkedWith ? cboMapping.linkedWith : '',
    chw: chwMapping && chwMapping.linkedWith ? chwMapping.linkedWith : '',
    patient: patMapping && patMapping.linkedWith ? patMapping.linkedWith : '',
    refId: metaInfo.moduleId,
    refStatus: 'Draft',
  };
  const refResponse = await refService.save(refData);
  return { status: true };
};

const checkUserObj = async (performer, onBehalfOf, assignedTo,acceptedBy) => {
  try {
    if (!performer) {
      performer = {};
      performer.role = {};
    }
    if (!onBehalfOf) {
      onBehalfOf = {};
      onBehalfOf.role = {};
    }
    if (!assignedTo) {
      assignedTo = {};
      assignedTo.role = {};
    }
     if (!acceptedBy) {
      acceptedBy = {};
      acceptedBy.role = {};
    }


    performer.role.role =
      Object.keys(performer).length > 0
        ? performer.role.role.toLowerCase()
        : '';
  } catch (er) {}
  try {
    onBehalfOf.role.role =
      Object.keys(onBehalfOf).length > 0
        ? onBehalfOf.role.role.toLowerCase()
        : '';
  } catch (er) {}
  try {
    assignedTo.role.role =
      Object.keys(assignedTo).length > 0
        ? assignedTo.role.role.toLowerCase()
        : '';
  } catch (er) {}


    try {
    acceptedBy.role.role =
      Object.keys(acceptedBy).length > 0
        ? acceptedBy.role.role.toLowerCase()
        : '';
  } catch (er) {}

  const userDetails = {
    performer: performer,
    assignedTo: assignedTo,
    onBehalfOf: onBehalfOf,
    acceptedBy:acceptedBy
  };

  return userDetails;
};

const returnName = async (user) => {
  let userName = '';
  if (user && user !== '') {
    if (user.role.role === 'patient') {

      try{
     const resPatient = await userService.getPatientFHIRInfo({
        emailId: user.email,
      });
      if (resPatient) {
        if (resPatient.name && resPatient.name.length !== 0) {
          user.lastName = resPatient.name[0].family
            ? resPatient.name[0].family
            : '';
          if (
            resPatient.name[0].given &&
            resPatient.name[0].given.length !== 0
          ) {
            if (resPatient.name[0].given.length === 1) {
              user.firstName = resPatient.name[0].given[0];
            } else {
              user.firstName = `${resPatient.name[0].given[0]} ${resPatient.name[0].given[1]}`;
            }
          }
        }
      } 

      }
      catch(err){

      }
 
    }
    if (user.firstName && user.lastName) {
      userName = user.firstName + ' ' + user.lastName;
    } else {
      userName = user.email;
    }
  }
  return userName;
};

const createMetaObjWithUserName = async (
  metaInfo,
  performer,
  onBehalfOf,
  assignedTo,
  acceptedBy
) => {
  var msgContextObject = { ...metaInfo };
  msgContextObject.performer = await returnName(performer);
  msgContextObject.onBehalfOf = await returnName(onBehalfOf);
  msgContextObject.assignedTo = await returnName(assignedTo);
  msgContextObject.acceptedBy = await returnName(acceptedBy);
  return msgContextObject;
};


const returnUserId = async (userInfoArray,userType,id,isTrue) => {
 const index = await helperService.returnIndexOfObject(
    userInfoArray,
    userType,
    isTrue
  );
  let linkedId = "";
  if (index !== -1) {
   linkedId = (userInfoArray[index][id])?userInfoArray[index][id].toString():"";
  }
  return linkedId;
}


const createMetaObjNewKey = async (metaInfo, userInfoArray) => {
  var metaObject = { ...metaInfo };
  metaObject.patient = '';
  metaObject.cbo = '';
  metaObject.chw = '';
  metaObject.acceptedBy = '';

  /* get user sid or uuid fron userInfoArray and set to metaObject */

  //   const patientindex = await helperService.returnIndexOfObject(
  //   userInfoArray,
  //   'patient',
  //   false
  // );

  // if (patientindex !== -1) {
  //   metaObject['patient'] = userInfoArray[patientindex].sid
  //     ? userInfoArray[patientindex].sid.toString()
  //     : '';
  // } else {
  //   metaObject['patient'] = '';
  // }
  metaObject['patient'] = await returnUserId(userInfoArray,'patient','sid',false);
  metaObject['cbo'] = await returnUserId(userInfoArray,'cbo-organization','uuid',false);
  if(metaObject['cbo'] == ''){
   metaObject['cbo'] = await returnUserId(userInfoArray,'cbo','uuid',false);
  }
  metaObject['chw'] = await returnUserId(userInfoArray,'chw','uuid',false);
  
  if(metaObject.acceptedByOfRefId && metaObject.acceptedByOfRefId != "" && metaObject.acceptedByOfRefId != undefined){
    metaObject['acceptedBy'] = await returnUserId(userInfoArray,'cbo','uuid',true);
  if(metaObject['acceptedBy'] == ''){
   metaObject['acceptedBy'] = await returnUserId(userInfoArray,'cbo-organization','uuid',true);
  }
  }



  // const cboindex = await helperService.returnIndexOfObject(
  //   userInfoArray,
  //   'cbo',
  //   false
  // );
  // if (cboindex !== -1) {
  //   metaObject['cbo'] = userInfoArray[cboindex].uuid
  //     ? userInfoArray[cboindex].uuid.toString()
  //     : '';
  // } else {
  
  //  const cboorgindex = await helperService.returnIndexOfObject(
  //   userInfoArray,
  //   'cbo-organization',
  //   false
  // );
   
  // if(cboorgindex !== -1){
  //    metaObject['cbo'] = userInfoArray[cboorgindex].uuid
  //     ? userInfoArray[cboorgindex].uuid.toString()
  //     : '';
  // }
  // else{
  //      metaObject['cbo'] = ''; 
  // }

  // }





  // const chwindex = await helperService.returnIndexOfObject(
  //   userInfoArray,
  //   'chw',
  //   false
  // );
  // if (chwindex != -1) {
  //   metaObject['chw'] = userInfoArray[chwindex].uuid
  //     ? userInfoArray[chwindex].uuid.toString()
  //     : '';
  // } else {
  //   metaObject['chw'] = '';
  // }
  

  return metaObject;
};

const createAutomateTask = async (
  req,
  res,
  taskTemplates,
  performer,
  receiverData,
  userType,
  msgContextObject,
  pageLinkContext,
  taskUniqueId,
  metaInfo,
  createdBy,
  userRole,
  isSelfTask,
  senderUserType
) => {
  for (let k = 0; k < taskTemplates.length; k++) {
    console.log(' taskTemplates >>>> ', taskTemplates[k]);
    var curTaskTemplate = taskTemplates[k];

    var taskData = {};
    taskData.body = {
      // senderId: performer && performer._id ? performer._id : null,
      // senderType: curTaskTemplate.sender,
      senderId: receiverData && receiverData._id ? receiverData._id : null,
      senderType: userType.toString(),
      actorId: receiverData && receiverData._id ? receiverData._id : null,
      actorType: userType.toString(),
      meta: req.body.meta,
      title: curTaskTemplate.title,
      message: curTaskTemplate.message,
      isAutomate: true,
      automate_workflow_related:(curTaskTemplate.automate_workflow_related)?curTaskTemplate.automate_workflow_related:false
    };

    if(isSelfTask == true){
      taskData.body.senderId = receiverData && receiverData._id ? receiverData._id : null;
    }
    else{
      taskData.body.notifiedUserId = (performer && performer._id) ? performer._id : null;
      if(senderUserType != '' && senderUserType  == 'cbo-organization'){
       taskData.body.notifiedUserType = senderUserType;
      }
      else{
        taskData.body.notifiedUserType = curTaskTemplate.sender;
      }
      
    }

    taskData.body.dueDate = moment().add(
      curTaskTemplate.dueTime,
      curTaskTemplate.dueTimeType
    )._d;

    const msgTemplate = curTaskTemplate.message;
    const tempMessage = await helperService.compileTemplate(
      msgTemplate,
      msgContextObject
    );
    taskData.body.message = tempMessage;

    const msgTemplate_sp = curTaskTemplate._doc.message_sp;
    const tempMessage_sp = await helperService.compileTemplate(
      msgTemplate_sp,
      msgContextObject
    );
    taskData.body.message_sp = tempMessage_sp;

    if (curTaskTemplate._doc.pageLink) {
      let tasklink = await helperService.compileTemplate(
        curTaskTemplate._doc.pageLink,
        pageLinkContext
      );
      tasklink = `${domain[curTaskTemplate.redirectTo]}${tasklink}`;
      taskData.body.url = tasklink;
    }

    taskData.body.meta.uniqueId = uuidv4();


    const createdTask = await taskDao.create(taskData, res);
    const taskId = createdTask._id.toString();
    taskUniqueId = taskId;
    pageLinkContext.taskId = taskUniqueId;
    let cloneMetaInfo = { ...metaInfo };
    let cloneMsgContextObject = { ...msgContextObject };

    cloneMsgContextObject.documentName = taskData.body.title;
    cloneMetaInfo.type = 'automate_task';
    cloneMetaInfo.action = 'automate_task';
    cloneMetaInfo.documentName = taskData.body.title;
    cloneMetaInfo.documentId = taskId;
    cloneMetaInfo.subModule = 'Task';
    cloneMetaInfo.entity = 'automate_task';
    let auditResponse = await helperService.saveAuditData(
      req,
      cloneMetaInfo,
      createdBy,
      userRole,
      cloneMsgContextObject
    );
  }

  return { taskUniqueId: taskUniqueId, pageLinkContext: pageLinkContext };
};

const createNotificationDataandsend = async (
  req,
  res,
  notificationTemplates,
  nType,
  performer,
  receiverData,
  userType,
  data,
  pageUrl,
  taskUniqueId,
  pageLinkContext,
  metaObject,
  msgContextObject,
  lang,
  currentObject
) => {
  for (let m = 0; m < notificationTemplates.length; m++) {
    console.log(' notificationTemplates >>>> ', notificationTemplates[m]);
    const curNotificationTemplate = notificationTemplates[m];
    const { title } = curNotificationTemplate;

    const messageTemp = curNotificationTemplate.message;
    const notifyMessage = await helperService.compileTemplate(
      messageTemp,
      msgContextObject
    );
    const messageTemp_sp = curNotificationTemplate.message_sp;
    const notifyMessage_sp = await helperService.compileTemplate(
      messageTemp_sp,
      msgContextObject
    );

    let notificationMsg = notifyMessage;

    if (lang === 'sp') {
      notificationMsg = notifyMessage_sp;
    }

    const notificationData = {};
    notificationData.body = {
      type: nType._id,
      senderId: performer && performer._id ? performer._id : '',
      senderType: req.body.sender.type,
      receiverId: receiverData && receiverData._id ? receiverData._id : '',
      receiverType: userType,
      meta: req.body.meta,
      read: false,
      notificationType: data.type,
      title,
      message: notifyMessage,
      message_sp: notifyMessage_sp,
    };

    if (pageUrl !== '') {
      notificationData.body.taskId = taskUniqueId;
    }

    const notifyPageUrlTemp = curNotificationTemplate.pageLink;
    let notifyPageUrl = await helperService.compileTemplate(
      notifyPageUrlTemp,
      pageLinkContext
    );
    if (currentObject.isTask === true && curNotificationTemplate.taskLink) {
      notifyPageUrl = await helperService.compileTemplate(
        curNotificationTemplate.taskLink,
        pageLinkContext
      );
    }
    pageUrl = `${domain[curNotificationTemplate.redirectTo]}${notifyPageUrl}`;

    notificationData.body.url = pageUrl;
    const notificationRes = await createNotification(notificationData, res);

    if (curNotificationTemplate.deliveryChannel.name === 'MobilePush') {
      const nReq = {};
      nReq.body = {
        type: nType._id,
        sender: { id: performer.uuid ? performer.uuid : performer.sid },
        receiver: [{ id: metaObject[userType] }],
        meta: req.body.meta,
        notificationType: req.body.type,
        title,
        message: notificationMsg,
      };
      nReq.body.appName = 'FS';
      nReq.body.meta.url = pageUrl;
      console.log('nReq--->', nReq.body);
      try {
        await notificationService.sendMobileNotification(nReq.body);
      } catch (err) {
        console.log('data check ->> ', JSON.stringify(err));
      }
    } else {
      notificationData.body._id = notificationRes._id;
      await notificationService.sendNotification(notificationData.body);
    }
  }

  return { status: true };
};

const setLinkedWith = async (metaInfo) => {

  if (
    metaInfo.assignedTo &&
    !metaInfo.assignedTo.toString().match(/^[0-9a-fA-F]{24}$/)
  ) {
    const assignedToMapping = await mappingService.getMapping({
      uid: metaInfo.assignedTo,
    });
    if (assignedToMapping) {
      metaInfo.assignedToRefId = assignedToMapping.linkedWith;
    }
  }
 

  if (
    metaInfo.performer &&
    !metaInfo.performer.toString().match(/^[0-9a-fA-F]{24}$/)
  ) {
    const performerMapping = await mappingService.getMapping({
      uid: metaInfo.performer,
    });
    if (performerMapping) {
      metaInfo.performerRefId = performerMapping.linkedWith;
    }
  }
 
  if (
    metaInfo.onBehalfOf &&
    !metaInfo.onBehalfOf.toString().match(/^[0-9a-fA-F]{24}$/)
  ) {
    const onBehalfOfMapping = await mappingService.getMapping({
      uid: metaInfo.onBehalfOf,
    });
    if (onBehalfOfMapping) {
      metaInfo.onBehalfOfRefId = onBehalfOfMapping.linkedWith;
    }
  }

    if (
    metaInfo.acceptedBy &&
    !metaInfo.acceptedBy.toString().match(/^[0-9a-fA-F]{24}$/)
  ) {
    const acceptedOfMapping = await mappingService.getMapping({
      uid: metaInfo.acceptedBy,
    });
    if (acceptedOfMapping) {
      metaInfo.acceptedByOfRefId = acceptedOfMapping.linkedWith;
    }
  }
  
  
  return metaInfo;
};

const callback = async (req, res) => {
  logger.info(`Notification : dao : callback : received request`);
  try {
    var lang = constants.language;

    var data = req.body;
    data.sender.type = data.sender.type.toLowerCase();
    if (data.type === 'referral_created') {
    data.meta.acceptedBy = "";
    }
    var metaInfo = data.meta;
    var isSelfTask = (metaInfo.isSelfTask)?metaInfo.isSelfTask:false;

    const nReq = {};

    /* get notification type data using notification type */



    const nType = await notificationType.findOne({ name: data.type });

    var sentFor = nType.sentFor;
 
    /* ends get notification type data using notification type */

    /* get user details for performer, ohBehalfOf, assignedTo */
    var performer = { role: {} };
    var onBehalfOf = { role: {} };
    var assignedTo = { role: {} };
    var acceptedBy = { role: {} };

    metaInfo.performer = metaInfo.performer ? metaInfo.performer : '';
    metaInfo.onBehalfOf = metaInfo.onBehalfOf ? metaInfo.onBehalfOf : '';
    metaInfo.assignedTo = metaInfo.assignedTo ? metaInfo.assignedTo : '';
    metaInfo.acceptedBy = metaInfo.acceptedBy?metaInfo.acceptedBy:"";

    if (metaInfo.performer && metaInfo.performer !== '') {
      let pquery = {
        $and: [
          { $or: [{ sid: metaInfo.performer }, { uuid: metaInfo.performer }] },
          { uuidEnable: true },
        ],
      };

      if (metaInfo.performer.toString().match(/^[0-9a-fA-F]{24}$/)) {
        pquery = { _id: metaInfo.performer, uuidEnable: true };
      }
      performer = await getUserDetails(pquery);
    }
    if (metaInfo.onBehalfOf && metaInfo.onBehalfOf !== '') {
      let onBehalfquery = {
        $and: [
          {
            $or: [{ sid: metaInfo.onBehalfOf }, { uuid: metaInfo.onBehalfOf }],
          },
          { uuidEnable: true },
        ],
      };
      if (metaInfo.onBehalfOf.toString().match(/^[0-9a-fA-F]{24}$/)) {
        onBehalfquery = { _id: metaInfo.onBehalfOf, uuidEnable: true };
      }
      onBehalfOf = await getUserDetails(onBehalfquery);
    }
    if (metaInfo.assignedTo && metaInfo.assignedTo !== '') {
      let assignToquery = {
        $and: [
          {
            $or: [{ sid: metaInfo.assignedTo }, { uuid: metaInfo.assignedTo }],
          },
          { uuidEnable: true },
        ],
      };
      if (metaInfo.assignedTo.toString().match(/^[0-9a-fA-F]{24}$/)) {
        assignToquery = { _id: metaInfo.assignedTo, uuidEnable: true  };
      }
      assignedTo = await getUserDetails(assignToquery);
    }



     if (metaInfo.acceptedBy && metaInfo.acceptedBy !== '') {
      let acceptedToquery = {
        $and: [
          {
            $or: [{ sid: metaInfo.acceptedBy }, { uuid: metaInfo.acceptedBy }],
          },
          { uuidEnable: true },
        ],
      };
      if (metaInfo.acceptedBy.toString().match(/^[0-9a-fA-F]{24}$/)) {
        acceptedToquery = { _id: metaInfo.acceptedBy, uuidEnable: true  };
      }
      acceptedBy = await getUserDetails(acceptedToquery);
    }



    metaInfo = await setLinkedWith(metaInfo);
    /* end get user details for performer, ohBehalfOf, assignedTo */

    

    /* check user object is null then set empty object */
    const userDetails = await checkUserObj(performer, onBehalfOf, assignedTo,acceptedBy);
    performer = userDetails.performer;
    onBehalfOf = userDetails.onBehalfOf;
    assignedTo = userDetails.assignedTo;
    acceptedBy = userDetails.acceptedBy;
    /* end check user object is null then set empty object */

    /* save referral */
    if (data.type === 'referral_created') {
      saveReferral(metaInfo);
    }

    /* end save referral */
    /* push all user into array */
    var userInfoArray = [];
    acceptedBy.role.acceptedBy = true;
    performer.role.acceptedBy = false;
    onBehalfOf.role.acceptedBy = false;
    assignedTo.role.acceptedBy = false;
    userInfoArray.push(performer);
    userInfoArray.push(onBehalfOf);
    userInfoArray.push(assignedTo);
    userInfoArray.push(acceptedBy);

    /* end push all user into array */

    /* create 2 separate meta object for audit and notification */
    var msgContextObject = await createMetaObjWithUserName(
      metaInfo,
      performer,
      onBehalfOf,
      assignedTo,
      acceptedBy
    );
    var metaObject = await createMetaObjNewKey(metaInfo, userInfoArray);
    /* create 2 separate meta object */

    /* save audit */
    const action = data.type;
    let createdBy = "";
    let userRole = "";
    if(acceptedBy && acceptedBy._id){
    createdBy =  acceptedBy._id;
    userRole = acceptedBy.role && acceptedBy.role.role ? acceptedBy.role.role.toLowerCase() :"";
    }
    else if(performer && performer._id){
     createdBy =  performer._id;
    userRole = performer.role && performer.role.role ? performer.role.role.toLowerCase() :"";
    }

    metaInfo['action'] = action;
    if(data.type === 'referral_status_update' && data.updatedByData && Object.keys(data.updatedByData).length >0 ){
      let performerFullName = "";
      if(data.updatedByData.firstName){
        performerFullName = data.updatedByData.firstName;
        if(data.updatedByData.lastName){
          performerFullName = performerFullName+" "+data.updatedByData.lastName;
        }
      }
      else{
        performerFullName = data.updatedByData.email;
      }

      msgContextObject.performer = performerFullName;
    }
    let auditResponse = await helperService.saveAuditData(
      req,
      metaInfo,
      createdBy,
      userRole,
      msgContextObject
    );

    if (data.type === 'referral_status_updated') {
      updateReferral(metaInfo, userDetails, res,req,msgContextObject,createdBy,userRole);
    }

    /* end save audit */

    if (nType) {
      for (var j = 0; j < sentFor.length; j++) {
        const currentObject = sentFor[j];
        const userType = currentObject.type;
        const taskTemps = currentObject.taskTemplate;
        const notificationTemps = currentObject.notificationTemplate;
        var taskTemplateQuery = { _id: { $in: taskTemps } };
        var notificationTemplateQuery = { _id: { $in: notificationTemps } };

        var notificationTemplates = await notificationTemplateService.findAll(
          notificationTemplateQuery
        );
        var taskTemplates = await taskTemplateService.findAll(
          taskTemplateQuery
        );

        let pageUrl = '';
        var pageLinkContext = { ...metaInfo };
        pageLinkContext.taskId = '';

        let taskUniqueId = '';

        const index = await helperService.returnIndexOfObject(
          userInfoArray,
          userType.toLowerCase(),
          false
        );
        let receiverData = null;
        if (index !== -1) {
          receiverData = userInfoArray[index];
        }

        if(receiverData != null){



        /* create automatic task */
        if (currentObject.isTask === true) {
          let senderUserType = (data.sender.type)?data.sender.type:"";
          let taskResp = await createAutomateTask(
            req,
            res,
            taskTemplates,
            performer,
            receiverData,
            userType,
            msgContextObject,
            pageLinkContext,
            taskUniqueId,
            metaInfo,
            createdBy,
            userRole,
            isSelfTask,
            senderUserType

          );
          taskUniqueId = taskResp.taskUniqueId;
          pageLinkContext = taskResp.pageLinkContext;
        }

        /* end create automatic task */

        /* parse notification template and sent notification */
        let notificationSendResponse = await createNotificationDataandsend(
          req,
          res,
          notificationTemplates,
          nType,
          performer,
          receiverData,
          userType,
          data,
          pageUrl,
          taskUniqueId,
          pageLinkContext,
          metaObject,
          msgContextObject,
          lang,
          currentObject
        );
      }

        /* end parse notification template and sent notification */
      }
    }
  } catch (e) {
    logger.error(`notification : dao : callback : Error : ${e}`);
    throw e;
  }
};
const get = async (req, res) => {
logger.info(`Notification : dao : get : received request`);

  var respObject = { count: 0, data: [] };
  let queryObject = {};
  queryObject['$or']= [{ receiverId: req.query.receiverId }];
  queryObject['senderId'] = {$ne:req.decoded._id.toString()};
  try {
    var response, responseCount;
  
    let org = (req.decoded)?req.decoded.organization:"";
    if(req.query.receiverId == "" || req.query.receiverId == null || req.query.receiverId == undefined){
       res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
    }
    let userObj = await userModel.findOne({"_id":mongoose.Types.ObjectId(req.query.receiverId)});
   
    if(req.decoded.role.role.toLowerCase() == 'cbo' || req.decoded.role.role.toLowerCase() == 'cbo-organization'){
    let adminRole =  await roleModel.findOne({"role":"cbo-organization"});
    if(req.query.receiverId != req.decoded._id.toString() && userObj.organization.toString() == org && userObj.role.toString() == adminRole._id.toString()){
     queryObject['$or'].push({"receiverId":req.decoded._id.toString()});
    }
    else if(req.query.receiverId == req.decoded._id.toString()){

    }
    else{
      res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"}); 
    }
    }
    else{
    if(userObj.organization.toString() != org){
      res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});   
    }
    }



    if (req.query.page) {
      var page = parseInt(req.query.page);
      var limit = 10;
      var skip = (page - 1) * 10;

      responseCount = await notificationModel.find(queryObject);
      response = await notificationModel
        .find(queryObject)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      respObject['count'] = responseCount.length;
    } else {
      response = await notificationModel
        .find(queryObject)
        .limit(5)
        .sort({ createdAt: -1 });
    }
    respObject['data'] = response;
    return respObject;
  } catch (e) {
    logger.error(`Notification : dao : get : Error : ${e}`);
    throw e;
  }
};

const update = async (req, res) => {
  logger.info(`Notification : dao : update : received request`);
  try {
    const id = req.params.id;
    const data = req.body;
    const response = await notificationModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (req.query.role && req.query.role === 'Patient') {
      const header = {};
      const notObj = {};
      const updateNotification = await fetchWrapper.put(
        `${fhirAppUrl}/api/notifications/callback/${req.params.id}`,
        notObj,
        header
      );
    }
    return response;
  } catch (e) {
    logger.error(`Notification : dao : update : Error : ${e}`);
    throw e;
  }
};

const updateAll = async (req, res) => {
  logger.info(`Notification : dao : updateAll : received request`);
  try {
    const id = req.params.id;
    let org = (req.decoded)?req.decoded.organization:"";
    const data = req.body;
    if(req.params.id == "" || req.params.id == null || req.params.id == undefined){
       res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
    }
     let query = {};
    query['$or'] = [{"receiverId":req.params.id}];

     let userObj = await userModel.findOne({"_id":mongoose.Types.ObjectId(req.params.id)});

    if(req.decoded.role.role.toLowerCase() == 'cbo' || req.decoded.role.role.toLowerCase() == 'cbo-organization'){
    let adminRole =  await roleModel.findOne({"role":"cbo-organization"});
    if(req.params.id != req.decoded._id.toString() && userObj.organization.toString() == org && userObj.role.toString() == adminRole._id.toString()){
     query['$or'].push({"receiverId":req.decoded._id.toString()});
    }
    else if(req.params.id == req.decoded._id.toString()){

    }
    else{
      res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"}); 
    }
    }
    else{
    if(userObj.organization.toString() != org){
          res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});   
    }
    }
 

    const response = await notificationModel.updateMany(
      query,
      data
    );
    return response;
  } catch (e) {
    logger.error(`Notification : dao : updateAll : Error : ${e}`);
    throw e;
  }
};

const getById = async (req, res) => {
  logger.info(`Notification : dao : getById : received request`);
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;
    let org = (req.decoded)?req.decoded.organization:"";

    if(req.params.id == "" || req.params.id == null || req.params.id == undefined){
       res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
    }

    let query = {};
    query['read'] = false;
    query['$or'] = [{"receiverId":req.params.id}];
    query['receiverType'] = {$ne:'patient'};
    query['senderId'] = {$ne:req.decoded._id.toString()};

     let userObj = await userModel.findOne({"_id":mongoose.Types.ObjectId(req.params.id)});

    if(req.decoded.role.role.toLowerCase() == 'cbo' || req.decoded.role.role.toLowerCase() == 'cbo-organization'){
    let adminRole =  await roleModel.findOne({"role":"cbo-organization"});
    if(req.params.id != req.decoded._id.toString() && userObj.organization.toString() == org && userObj.role.toString() == adminRole._id.toString()){
     query['$or'].push({"receiverId":req.decoded._id.toString()});
    }
    else if(req.params.id == req.decoded._id.toString()){

    }
    else{
      res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"}); 
    }
    }
    else{
    if(userObj.organization.toString() != org){
          res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});   
    }
    }

    const response = await notificationModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const totalCount = await notificationModel.count(query);

    return { status: true, data: response, count: totalCount };
  } catch (e) {
    logger.error(`Notification : dao : getById : Error : ${e}`);
    throw e;
  }
};

const getByRoomId = async (req, res) => {
  logger.info(`Notification : dao : getByRoomId : received request`);
  try {
  
  let org = (req.decoded)?req.decoded.organization:"";
    if(req.query.receiverId == "" || req.query.receiverId == null || req.query.receiverId == undefined){
       res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
    }

    let query = {};
     
    query['$or'] = [{"receiverId":req.query.receiverId}];
    query['meta.roomId'] = req.params.id;
    query['senderId'] = {$ne:req.decoded._id.toString()};
    query['read'] = false;

    const response = await notificationModel.findOne(query);

    return { status: true, data: response };
  } catch (e) {
    logger.error(`Notification : dao : getByRoomId : Error : ${e}`);
    throw e;
  }
};

module.exports.getByRoomId = getByRoomId;
module.exports.updateAll = updateAll;
module.exports.getById = getById;
module.exports.update = update;
module.exports.get = get;
module.exports.callback = callback;
module.exports.createNotification = createNotification;
