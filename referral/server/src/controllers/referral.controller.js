var referralService = require('../services/referral.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');
var helperService = require('../services/helper.service');
var userService = require('../services/user.service');
const notificationService = require('../services/notification.service');
const auditService = require('../services/audit.service');
const users = require('../models/user');

var get = async function (req, res, next) {
  try {
    var referralResponse = await referralService.get(req, res);
    res.json(referralResponse);
  } catch (e) {
    var error = 'Failed to get  referral';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getReferrals = async function (req, res, next) {
  try {
    var referralResponse = await referralService.getReferrals(req, res);
    // var recordResp = await referralService.fillRefIds(referralResponse.data);
    // var helperResp = await helperService.convertResourceToFhirToBundle(recordResp);

    var helperResp = await helperService.convertResourceToFhirToBundle(referralResponse.data);
    let object={
      count:referralResponse.count,
      data:helperResp
    }
    res.json(object);
  } catch (e) {
    var error = 'Failed to get by id referral';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};
 
var save = async function (req, res, next) {
  try {
   

   // let cboUserUuid=req.body.performer.uuid;
    var data=req.body;
    delete data.reqeuesterUuid;
    let sid= '';
    let cboUserUuid = '';
    let reqeuesterUuid = '';

    const cboData = await users.findOne({_id:req.body.performer._id});

    if(cboData){
      cboUserUuid = cboData.uuid ?cboData.uuid :'';
    }
    const chwData = await users.findOne({_id:req.body.requester});
    if(chwData){
      reqeuesterUuid = chwData.uuid?chwData.uuid:'';
    }
    const patData = await users.findOne({_id:req.body.patient._id});
    if(patData){
      sid = patData.sid ?patData.sid:'';
    }
    // let sid=req.body.patient.sid;

    var referralResponse = await referralService.save({});
    data._id=referralResponse._id;

    data.authoredOn = referralResponse._doc.createdAt;
    req.body.authoredOn = referralResponse._doc.createdAt;
    var helperResp = await helperService.convertToFhirReferral(data);
    
    let _id=referralResponse._id.toString();
    helperResp["id"]=_id.toString();
    let object={};
    let dataObject={
      data:helperResp,
      sid: req.body.patient._id,
      cbo: req.body.performer._id,
      user: req.body.requester,
      rawData:req.body
    }
    var referralsResponse = await referralService.update({_id:_id},dataObject);
        if (referralsResponse) {
          const notification = Object.assign({},constants.notification);
      notification.sender.id = reqeuesterUuid;
      notification.sender.type = 'Chw';
      notification.meta.assignedTo=cboUserUuid;
      notification.meta.onBehalfOf=sid;
      notification.meta.performer=reqeuesterUuid;
      notification.meta.documentName=data.categoryLabel;
      notification.type = 'referral_created';
      notification.meta.module = 'Referral';
      notification.meta.moduleId = _id;
      notification.meta.subModule = '';
      notification.meta.subModuleId = '';
      notification.meta.entity = "Referral";
      notification.meta.auditType = "Referral";
      notification.meta.action = "referral_created";
      notification.receiver = [{ id: sid, type: 'Patient' }];
      console.log("notification-----//////-->",JSON.stringify(notification));

      notificationService.callBackRequest(notification);
       

      res.json(referralsResponse._doc);
    }
  } catch (e) {
    var error = 'Failed to save referral';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};



var update = async function (req, res, next) {
  try {
   

   // let cboUserUuid=req.body.performer.uuid;
    var data=req.body;
    let _id=data._id.toString();
    //let sid=req.body.patient.sid;

    delete data.reqeuesterUuid;
    let sid= '';
    let cboUserUuid = '';
    let reqeuesterUuid = '';

    const cboData = await users.findOne({_id:req.body.performer._id});

    if(cboData){
      cboUserUuid = cboData.uuid ?cboData.uuid :'';
    }
    const chwData = await users.findOne({_id:req.body.requester});
    if(chwData){
      reqeuesterUuid = chwData.uuid?chwData.uuid:'';
    }
    const patData = await users.findOne({_id:req.body.patient._id});
    if(patData){
      sid = patData.sid ?patData.sid:'';
    }

    let oldData = await referralService.findOne({_id:_id});
    data.authoredOn = oldData._doc.createdAt;
    req.body.authoredOn = oldData._doc.createdAt;
    var helperResp = await helperService.convertToFhirReferral(data);
    
    
    helperResp["id"]=_id.toString();
    let object={};
    let dataObject={
      data:helperResp,
      sid: req.body.patient._id,
      cbo: req.body.performer._id,
      user: req.body.requester,
      rawData:req.body
    }
    var referralsResponse = await referralService.update({_id:_id},dataObject);
        if (referralsResponse) {
          const notification = Object.assign({},constants.notification);
      notification.sender.id = reqeuesterUuid;
      notification.sender.type = 'Chw';
      notification.meta.assignedTo=cboUserUuid;
      notification.meta.onBehalfOf=sid;
      notification.meta.performer=reqeuesterUuid;
      notification.meta.documentName=data.categoryLabel;
      notification.type = 'referral_updated';
      notification.meta.module = 'Referral';
      notification.meta.moduleId = _id;
      notification.meta.subModule = '';
      notification.meta.subModuleId = '';
      notification.meta.entity = "Referral";
      notification.meta.auditType = "Referral";
      notification.meta.action = "referral_updated";
      notification.receiver = [{ id: sid, type: 'Patient' }];
      console.log("notification-----//////-->",JSON.stringify(notification));

      notificationService.callBackRequest(notification);
       

      res.json(referralsResponse._doc);
    }
  } catch (e) {
    var error = 'Failed to update referral';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};
 
var updateStatus = async function (req, res, next) {
  try {
    var status=req.body.status;
    let data = req.body;
    let id= req.params.id;
    let object={};
    let dataObject={
      'data.status':status.toLowerCase(),
      'rawData.status':status
    }  

    let sid= '';
    let cboUserUuid = '';
    let reqeuesterUuid = '';

    const cboData = await users.findOne({_id:data.performer});

    if(cboData){
      cboUserUuid = cboData.uuid ?cboData.uuid :'';
    }
    const chwData = await users.findOne({_id:data.requester});
    if(chwData){
      reqeuesterUuid = chwData.uuid?chwData.uuid:'';
    }
    const patData = await users.findOne({_id:data.patient});
    if(patData){
      sid = patData.sid ?patData.sid:'';
    }

    var referralsResponse = await referralService.update({_id:id},dataObject);
        if (referralsResponse) {
      const notification = Object.assign({},constants.notification);
      notification.sender.id = cboUserUuid;
      // notification.sender.type = 'Cbo';
       notification.sender.type = req.user.role;
      notification.meta.assignedTo=reqeuesterUuid;
      notification.meta.onBehalfOf=sid;
      notification.meta.acceptedBy = req.user.uuid;
      notification.meta.performer=cboUserUuid;
      notification.meta.documentName=data.categoryLabel;
      notification.meta.status = data.status
      notification.type = 'referral_status_updated';
      notification.meta.module = 'Referral';
      notification.meta.moduleId = id;
      notification.meta.subModule = '';
      notification.meta.subModuleId = '';
      notification.meta.entity = "Referral";
      notification.meta.auditType = "Referral";
      notification.meta.action = "referral_status_updated";
      notification.receiver = [{ id: sid, type: 'Patient' }];

       console.log("notification---updateStatus--//////-->",JSON.stringify(notification));

      notificationService.callBackRequest(notification);
       

      res.json(referralsResponse._doc);
    }
  } catch (e) {
    var error = 'Failed to update referral';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}; 



var getReferral = async function (req, res, next) {
  try {
    var referralResponse = await referralService.getReferral(req, res);
    let refData=JSON.parse(JSON.stringify(referralResponse));
    let referralData=[];
    referralData.push(refData);
    //var recordResp = await referralService.fillRefIds(referralData);
    //res.json(recordResp[0]);
    res.json(referralData[0]);
  } catch (e) {
    var error = 'Failed to get referral by id';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.updateStatus = updateStatus;
module.exports.update = update;
module.exports.getReferral = getReferral;
module.exports.getReferrals = getReferrals;
module.exports.get = get;
module.exports.save = save;