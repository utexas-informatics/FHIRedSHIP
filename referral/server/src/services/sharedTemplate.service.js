/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
const logger = require('../config/logger');
const shared = require('../models/sharedTemplate');
const notificationService = require('./notification.service');
const constant = require('../config/constants');
const users = require('../models/user');
const questionnaireresponses = require('../models/questionnaireresponse');

var share = async function (req) {
  logger.info(`sharedTemplate : service : share : received request`);
 console.log('req.body --',req.body);
  try {
    const notification = Object.assign({},constant.notification);
    let sharedByUuid = '';
    const user = await users.findOne({_id:req.body.sharedBy});
    if(user){
      sharedByUuid = user.uuid;
    }
     notification.meta.onBehalfOf='';
     notification.meta.performer= sharedByUuid;
     notification.meta.documentName='';

    notification.sender.id =  sharedByUuid;
    notification.sender.type = 'Chw';
    notification.type = 'assessment_shared';
    notification.meta.module = 'Assessment';
    notification.meta.moduleId = req.body.templateId;
    notification.meta.entity = "Assessment";
    notification.meta.auditType = "Assessment";
    notification.meta.action = "assessment_shared";
    notification.meta.sharedBy = req.body.sharedBy;
    notification.receiver = [];
    for (let i = 0; i < req.body.sharedTo.length; i++) {
      const data = { ...req.body };
      data.sharedTo = {
        id: req.body.sharedTo[i].id,
        email: req.body.sharedTo[i].itemName,
       // sid: req.body.sharedTo[i].sid
      };
      const sharedTo = {
        id: req.body.sharedTo[i].sid,
        type: 'Patient',
      }
      notification.receiver.push(sharedTo);
      notification.meta.assignedTo=req.body.sharedTo[i].sid;
      let res = await shared.create(data);
      notification.meta.subModuleId = res._id.toString();
      notificationService.callBackRequest(notification);
    }

   // notificationService.callBackRequest(notification);
    return { status: true };
  } catch (e) {
    logger.error(`sharedTemplate : service : share : Error : ${e}`);

    throw e;
  }
};

var get = async function (req) {
  logger.info(`sharedTemplate : service : get : received request`);

  try {
    const response = await shared.findOne({
      templateId: req.body.templateId,
      sharedBy: req.body.sharedBy,
    });
    return response;
  } catch (e) {
    logger.error(`sharedTemplate : service : get : Error : ${e}`);

    throw e;
  }
};

var check = async function (req) {
  logger.info(`sharedTemplate : service : check : received request`);
 
  try {
    let patId = '';
    let userId = '';
    const pat = await users.findOne({sid:req.body.sid});

    if(pat){
      patId = pat._id.toString();;
    }

    // const user = await users.findOne({uuid:req.body.sharedBy});

    // if(user){
    //   userId = user._id.toString();
    // }

    userId = req.body.sharedBy;
    if(userId && patId){
      const response = await shared.findOne({
        '_id':req.body.sharedTemp,
        'templateId': req.body.templateId,
        'sharedBy': userId,
        'sharedTo.id' : patId
      });
      if(response){
        let respId = null;
        let checkResp = await questionnaireresponses.findOne({
          'sharedTempId':req.body.sharedTemp});
          respId = checkResp?checkResp._id:'';
        return { status: true,respId:respId };
      }
        return { status: false };
      
    }
      return { status: false };
  } catch (e) {
    logger.error(`sharedTemplate : service : check : Error : ${e}`);

    throw e;
  }
};

module.exports.check = check;
module.exports.share = share;
module.exports.get = get;
