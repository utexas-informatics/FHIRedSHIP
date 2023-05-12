var logger = require('../config/logger');
const mongoose = require('mongoose');
const shareModel = require('../models/share');
var constants = require('../config/constants');
const responseModel = require('../models/response');
const notificationDao = require('./notification.dao');

const shareForm = async (req,res) => {
  logger.info(`Response : dao : Share Form : received request`);
  try {
  
    const response = await shareModel.create({ ...req.body});
    const notification = {};
    notification.type = "screener shared";
    const sharedData = await shareModel
      .findOne({ _id: response._id })
      .populate('sharedWith')
    .populate('sharedBy');

    let sharebyType = 'Cbo';

    if(sharedData.sharedByType){
      sharebyType = sharedData.sharedByType;
    }
    notification.sender = {
      id: sharedData.sharedBy.uuid ? sharedData.sharedBy.uuid : '',
      type: sharebyType
    };
    notification.receiver = [
        {
          id: sharedData.sharedWith.sid ? sharedData.sharedWith.sid : '',
          type: 'Patient',
        },
      ];
    notification.meta = {
      module: 'Referral',
      moduleId: req.body.moduleId,
      assignedTo: notification.receiver[0].id,
      onBehalfOf: '',
      performer: notification.sender.id,
      documentName: '',
      subModule: 'Form Share',
      subModuleId: response._id,
      auditType:"Form",
      entity:"Form",
      type:"form_shared"
    };
 
    for(var a =0; a < req.body.forms.length; a++){
    notification.meta.formName = req.body.forms[a].name;
    notification.meta.formId = req.body.forms[a]._id;
    let responseData = {};
    responseData['submittedBy'] = req.body.sharedWith;
    responseData['moduleId'] = req.body.moduleId;
    responseData['data']={};
    responseData['templateId'] = req.body.forms[a]._id;
    const resp = await responseModel.create({ ...responseData });
    notification.meta.responseId = resp._id;
    notification.meta.taskEventId = resp._id.toString();
    const nReq = {};
     nReq.body = notification;
    notificationDao.callback(nReq, res);
    }
   
    if (response && response!=null) {
      return response;
    }
    throw new Error(`Form Not Share`);
  } catch (e) {
    logger.error(`Response : dao : Share Form : Error : ${e}`);
    throw e;
  } 
};


module.exports.shareForm = shareForm;