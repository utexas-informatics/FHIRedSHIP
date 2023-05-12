/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
/* eslint-disable linebreak-style */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
const logger = require('../config/logger');
const users = require('../models/users');
var constants = require('../config/constants');
const organization = require('../services/organization.service');
const mappingService = require('../services/mapping.service');
const refService = require('./referral.service');
const notesModal = require('../models/notes');
const userModel = require("../models/users");
const userService = require('../services/user.service');
const roles = require('../models/role');
//import Handlebars from "handlebars";
const Handlebars = require('handlebars');
const { createAudit } = require('../services/audit.service');
var PATH = require('path');
var fs = require('fs');
var formidable = require('formidable');
//const multer = require('multer')
//const upload = multer({ dest: './uploads' }).single('logo')
  
var getUserDetails = async function (userObject) {
  logger.info(`user : service : getUser : received request`);
  try {
    //const user = await users.findOne(userObject).populate('role', 'role').populate('adminId');
      if(Object.keys(userObject).length == 0){
      return {};
      }
      else{
          const user = await users.findOne(userObject).populate('role', 'role');
            return user;
      }
    
  
  } catch (e) {
    return '';
  }
};

var isFileAllowed = function (fileName) {
  let isAllowed = false;
  const allowedFiles = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];
  const regex = /(?:\.([^.]+))?$/;
  const extension = regex.exec(fileName);
  if (extension) {
      for (const ext of allowedFiles) {
          if (ext === extension[0]) {
              isAllowed = true;
          }
   }
  }
  return isAllowed;
}

var getUser = async function (userObject, key) {
  logger.info(`user : service : getUser : received request`);
  try {
    if(Object.keys(userObject).length == 0){
      return '';
    }
    const user = await users.findOne(userObject).populate('role', 'role');
    //const user = await users.findOne(userObject).populate('role', 'role').populate('adminId');
    if (user && user != null) {
      return user;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
};

var returnUserJson = async function (user) {
  var obj = {};

  obj = {
    id: user.id ? user.id : '',
    type: user.role,
  };

  return obj;
};

const returnName = async (userInfo) => {
  let user = await getUserDetails({"email":userInfo.email});
  console.log("returnName",user)
  let userName = '';
  if (user && user !== '') {
    if (user.role.role.toLowerCase() === 'patient') {
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
  assignedTo
) => {
  var msgContextObject = { ...metaInfo };
  msgContextObject.performer = await returnName(performer);
  msgContextObject.onBehalfOf = await returnName(onBehalfOf);
  msgContextObject.assignedTo = await returnName(assignedTo);

  return msgContextObject;
};

var returnNotificationJson = async function (
  notificationType,
  sender,
  receiver,
  onBehalfOf,
  moduleName,
  moduleId,
  documentName,
  documentId,
  subModuleName,
  subModuleId,
  auditType,
  entity,
  type
) {
  const notification = {};
  notification.type = notificationType;
  notification.sender = await returnUserJson(sender);
  notification.onBehalfOf = await returnUserJson(onBehalfOf);
  notification.receiver = await returnUserJson(receiver);
  var metaInfo = { ...constants.defaultMetaJson };
  notification.meta = metaInfo;
  notification.meta = {
    module: moduleName,
    moduleId: moduleId,
    assignedTo: notification.receiver.id,
    onBehalfOf: notification.onBehalfOf.id,
    performer: notification.sender.id,
    documentName: documentName,
    documentId: documentId,
    subModule: subModuleName,
    subModuleId: subModuleId,
    auditType: auditType,
    entity: entity,
    type: type,
  };
  return notification;
};

var getSpecificKeyPair = async function (user, key) {
  if (user && user != null) {
    let userResp = JSON.parse(JSON.stringify(user));
    let text = userResp[key] ? userResp[key] : '';
    return text;
  } else {
    return '';
  }
};

var splitAndReturn = async function (data, key) {
  let text = '';
  let arr = data.split(key);
  if (arr[1]) {
    return arr[1];
  } else {
    return text;
  }
};

var returnMappedAssesmentJson = async function (data) {
  let name = data.meta.extension[0].valueString;
  let desc = data.meta.extension[1].valueMarkdown;

  for (var k = 0; k < data.meta.extension.length; k++) {}

  let sid = await this.splitAndReturn(data.subject.reference, 'Patient/');
  let object = {
    _id: data.id,
    sid: sid,
    createdAt: data.authored,
    name: name,
    desc: desc,
  };
  return object;
};

var convertAsssesmentsFhirBundleToSimpleJson = async function (data) {
  logger.info(
    `convertAsssesmentsFhirBundleToSimpleJson : service : convertAsssesmentsFhirBundleToSimpleJson : received request`,
    data
  );
  try {
    let resp = [];
    for (let i = 0; i < data.entry.length; i++) {
      let resObject = await this.returnMappedAssesmentJson(
        data.entry[i].resource
      );
      resp.push(resObject);
    }
    return resp;
  } catch (e) {
    logger.error(
      `convertAsssesmentsFhirBundleToSimpleJson : service : convertAsssesmentsFhirBundleToSimpleJson : Error : ${e}`
    );
    throw e;
  }
};

var convertConditionFhirBundleToSimpleJson = async function (alldata) {
  logger.info(
    `convertConditionFhirBundleToSimpleJson : service : convertConditionFhirBundleToSimpleJson : received request`
  );
  try {
    let resp = [];

    let data = alldata.entry ? alldata.entry : [];

    for (let i = 0; i < data.length; i++) {
      let rObj = {
        questionnaireresponsId: data[i].resource.identifier[0].value,
        code: data[i].resource.code.coding[0].code,
        desc: data[i].resource.code.coding[0].display,
        need: data[i].resource.category[0].coding[0].display,
        condId: data[i].resource.id,
      };
      resp.push(rObj);
    }
    return resp;
  } catch (e) {
    logger.error(
      `convertConditionFhirBundleToSimpleJson : service : convertConditionFhirBundleToSimpleJson : Error : ${e}`
    );
    throw e;
  }
};

var convertReferralFhirBundleToSimpleJson = async function (alldata) {
  logger.info(
    `convertReferralFhirBundleToSimpleJson : service : convertConditionFhirBundleToSimpleJson : received request`
  );
  try {
    let resp = [];
    let data = alldata.entry ? alldata.entry : [];

    for (let i = 0; i < data.length; i++) {
      data[i].resource = data[i].resource ? data[i].resource : {};

      let patSubjectRef = data[i].resource.subject
        ? data[i].resource.subject.reference
        : '';
      var patientId = await this.splitAndReturn(patSubjectRef, 'Patient/');

      var totalCbos = [];
      if (data[i].resource.performer) {
        for (var k = 0; k < data[i].resource.performer.length; k++) {
          var cboId = await this.splitAndReturn(
            data[i].resource.performer[k].reference,
            'Organization/'
          );

          let cboMapping = await mappingService.getMapping({
            linkedWith: cboId,
          });
          let cboUid = cboMapping && cboMapping.uid ? cboMapping.uid : '';
          let cboData = null;
          if (cboUid) {
            cboData = await this.getUser({ uuid: cboUid });
            if (!cboData) {
              let orgData = await organization.getOrganization({
                uuid: cboUid,
              });
             // let orgName = await this.getSpecificKeyPair(orgData, 'name');
              let role = await roles.findOne({ role: 'cbo-organization' });
              cboData = await this.getUser({
                organization: orgData ? orgData._id : '',
                role: role._id,
              });
            }
          }

          let cboObj = {};
          let cboName = 'unknown';
          if (cboData) {
            cboName = await this.getSpecificKeyPair(cboData, 'email');
          }
          cboObj = {
            name: cboName,
            email: cboName,
            id: cboData ? cboData._id : '',
          };
          totalCbos.push(cboObj);
        }
      }

      let pracResource = data[i].resource.requester
        ? data[i].resource.requester.reference
        : '';
      let chwId = await this.splitAndReturn(pracResource, 'Practitioner/');

      let referralName =
        data[i].resource.category[0] && data[i].resource.category[0].coding[0]
          ? data[i].resource.category[0].coding[0].display
          : '';
      let referralDomain =
        data[i].resource.category[0] && data[i].resource.category[0].coding[0]
          ? data[i].resource.category[0].coding[0].code
          : '';

      let referralCode =
        data[i].resource.code && data[i].resource.code.coding[0]
          ? data[i].resource.code.coding[0].code
          : '';
      let referralCodeDesc =
        data[i].resource.code && data[i].resource.code.coding[0]
          ? data[i].resource.code.coding[0].display
          : '';
      let createdAt = data[i].resource.authoredOn
        ? data[i].resource.authoredOn
        : 'NA';
      let conditions = [];

      if (data[i].resource.reasonReference) {
        for (var c = 0; c < data[i].resource.reasonReference.length; c++) {
          let cond = await this.splitAndReturn(
            data[i].resource.reasonReference[c].reference,
            'Condition/'
          );
          conditions.push(cond);
        }
      }

      let patientMapping = await mappingService.getMapping({
        linkedWith: patientId,
      });
      let patientSid =
        patientMapping && patientMapping.uid ? patientMapping.uid : '';
      let patientData = await this.getUser({ sid: patientSid });
       let patientName = await this.getSpecificKeyPair(patientData, 'email');
      //let patientName = await returnName(patientData);
      console.log("patientName",patientName);
      let patientEmail = await this.getSpecificKeyPair(patientData, 'email');

      let chwMapping = await mappingService.getMapping({ linkedWith: chwId });
      let chwUid = chwMapping && chwMapping.uid ? chwMapping.uid : '';
      let chwData = null;
      if (chwUid){
        chwData = await this.getUser({ uuid: chwUid });
      }
      let chwName = 'unknown';
      if (chwData) {
        chwName = await this.getSpecificKeyPair(chwData, 'email');
      }
      let rObj = {
        _id: data[i].resource.id,
        patient: {
          name: patientName,
          email: patientEmail,
          id: patientData._id,
        },
        chw: {
          name: chwName,
          email: chwName,
          id: chwData ? chwData._id:'',
        },
        cbo: totalCbos,
        referralName: referralName,
        referralDomain: referralDomain,
        referralCode: referralCode,
        referralCodeDesc: referralCodeDesc,
        conditions: conditions,
        status: data[i].resource.status,
        date: createdAt,
      };

      resp.push(rObj);
    }
    return resp;
  } catch (e) {
    logger.error(
      `convertReferralFhirBundleToSimpleJson : service : convertReferralFhirBundleToSimpleJson : Error : ${e}`
    );
    throw e;
  }
};

var convertReferralFhirToSimpleJson = async function (data) {
  logger.info(
    `convertReferralFhirToSimpleJson : service : convertReferralFhirToSimpleJson : received request`
  );
  try {
    let resp = [];

    let patSubjectRef = data.subject ? data.subject.reference : '';

    var patientId = await this.splitAndReturn(patSubjectRef, 'Patient/');

    let chwRef = data.requester ? data.requester.reference : '';

    var chwId = await this.splitAndReturn(chwRef, 'Practitioner/');

    let patientMapping = await mappingService.getMapping({
      linkedWith: patientId,
    }); 
    let patientSid =
      patientMapping && patientMapping.uid ? patientMapping.uid : '';

    var patientData = await this.getUser({ sid: patientSid });
    var patientName = await this.getSpecificKeyPair(patientData, 'email');
    //let patientName = await returnName(patientData);
    console.log("patientName",patientName);
    var  patientEmail = await this.getSpecificKeyPair(patientData, 'email');

    let chwMapping = await mappingService.getMapping({ linkedWith: chwId });
    let chwUid = chwMapping && chwMapping.uid ? chwMapping.uid : '';

    let chwData = null;
    if (chwUid){
      chwData = await this.getUser({ uuid: chwUid });
    }
    let chwName = 'unknown';
    if (chwData) {
      chwName = await this.getSpecificKeyPair(chwData, 'email');
    }
    let referralName =
      data.category[0] && data.category[0].coding[0]
        ? data.category[0].coding[0].display
        : '';
    let referralDomain =
      data.category[0] && data.category[0].coding[0]
        ? data.category[0].coding[0].code
        : '';

    let referralCode =
      data.code && data.code.coding[0] ? data.code.coding[0].code : '';
    let referralCodeDesc =
      data.code && data.code.coding[0] ? data.code.coding[0].display : '';
    let conditions = [];

    if (data.reasonReference) {
      for (var c = 0; c < data.reasonReference.length; c++) {
        let cond = await this.splitAndReturn(
          data.reasonReference[c].reference,
          'Condition/'
        );
        conditions.push(cond);
      }
    }

    var totalCbos = [];

    if (data.performer) {
      for (var k = 0; k < data.performer.length; k++) {
        var cboId = await this.splitAndReturn(
          data.performer[k].reference,
          'Organization/'
        );

        let cboMapping = await mappingService.getMapping({ linkedWith: cboId });
        let cboUid = cboMapping && cboMapping.uid ? cboMapping.uid : '';


        let cboData = null;
        if (cboUid) {
          cboData = await this.getUser({ uuid: cboUid });
          if (!cboData) {
            let orgData = await organization.getOrganization({
              uuid: cboUid,
            });
           // let orgName = await this.getSpecificKeyPair(orgData, 'name');
            let role = await roles.findOne({ role: 'cbo-organization' });
            cboData = await this.getUser({
              organization: orgData ? orgData._id : '',
              role: role._id,
            });
          }
        }

        let cboObj = {};
        let cboName = 'unknown';
        if (cboData) {
          cboName = await this.getSpecificKeyPair(cboData, 'email');
        }
        cboObj = {
          name: cboName,
          email: cboName,
          id: cboData ? cboData._id : '',
          refcboId:cboId,
          appointmentData:
            cboData && cboData.appointmentData ? cboData.appointmentData : '',
        };
        totalCbos.push(cboObj);
      }
    }

    let createdAt = data.authoredOn ? data.authoredOn : 'NA';

    let rObj = {
      _id: data.id,
      patient: { name: patientName, id: patientData._id, email: patientEmail,refPatId:patientId },
      chw: {
        name: chwName,
        id: chwData ? chwData._id:'',
        email: chwName,
        appointmentData: chwData && chwData.appointmentData ? chwData.appointmentData : '',
        refchwId:chwId
      },
      cbo: totalCbos,
      referralName: referralName,
      referralDomain: referralDomain,
      referralCode: referralCode,
      referralCodeDesc: referralCodeDesc,
      conditions: conditions,
      status: data.status,
      date: createdAt,
    };
    return rObj;
  } catch (e) {
    logger.error(
      `convertReferralFhirToSimpleJson : service : convertReferralFhirToSimpleJson : Error : ${e}`
    );
    throw e;
  }
};

var compileTemplate = async function (html, object) {
  logger.info(`user : service : getUser : received request`);
  try {
    let template = Handlebars.compile(html);
    let result = template(object);
    return result;
  } catch (e) {
    return e;
  }
};

var returnIndexOfObject = async function (data, key,isTrue) {
  var index = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i].role) {
      if(isTrue == true){
      if (data[i].role.role == key && data[i].role.acceptedBy ==true) {
        index = i;
      }
      }
      else{
      if (data[i].role.role == key) {
        index = i;
      }
      }
     
    }
  }
  return index;
};

var returnValueByKey = async function (data, key) {
  let text = '';
  if (data[key]) {
    text = data[key];
  }
  return text;
};

var syncStatus = async function (data) {
  let refAllData = data;
  for (var a = 0; a < data.length; a++) {
    let refData = await refService.returnStatus({ refId: data[a]._id });
    if (refData) {
      refAllData[a].fs_status = refData.status
        ? refData.status
        : refData.refStatus;
     
      if(refData.acceptedBy){
      let acceptedByMapping = await mappingService.getMapping({
            linkedWith: refData.acceptedBy,
          });

      if(acceptedByMapping != null && acceptedByMapping != undefined){
         let uuid = (acceptedByMapping.uid)?acceptedByMapping.uid:"";
          let acceptedByData = null;
          if (uuid) {
            
          acceptedByData = await this.getUser({ uuid: uuid });
          let acceptedByName = await this.getSpecificKeyPair(acceptedByData, 'email');
            
          var acceptedByObj = {
          name: acceptedByName,
          email: acceptedByName,
          id: acceptedByData ? acceptedByData._id : '',
          appointmentData:
            acceptedByData && acceptedByData.appointmentData ? acceptedByData.appointmentData : '',
           };

          refAllData[a].acceptedBy = acceptedByObj;

          }
        }
      }


      let query = {};
      query['moduleId'] = data[a]._id;
      query['linkWith'] = 'status';
      query['meta.status'] = refAllData[a].fs_status;
      query['isDeleted'] = { $ne: true };
      let notesData = await notesModal.findOne(query).populate('submittedBy');
      refAllData[a].notes = notesData ? notesData : {};
    }
  }
  return refAllData;
};

var saveAuditData = async function (
  req,
  metainfo,
  createdBy,
  userRole,
  context
) {
  var msgConfig = constants.msgConfig;
  var action = metainfo.type ? metainfo.type : metainfo.action;
  console.log("context",context);
  let newContext = context;
  if(newContext.acceptedBy){
    newContext.performer  = newContext.acceptedBy;
  }

  if (msgConfig[action]) {
    const msgTemplate = msgConfig[action]['en'];
    const auditMessage = await this.compileTemplate(msgTemplate, newContext);
    const msgTemplate_sp = msgConfig[action]['sp'];
    const auditMessage_sp = await this.compileTemplate(msgTemplate_sp, newContext);

    var metaObject = {
      patient: '',
      cbo: '',
      chw: '',
      documentName: (metainfo.documentName)?metainfo.documentName:"",
      documentId: metainfo.documentId ? metainfo.documentId : '',
      module: (metainfo.module)?metainfo.module:"",
      moduleId: (metainfo.moduleId)?metainfo.moduleId:"",
      subModule: (metainfo.subModule)?metainfo.subModule:"",
      subModuleId: (metainfo.subModuleId)?metainfo.subModuleId:"",
      message_en: auditMessage,
      message_sp: auditMessage_sp,
      auditType: (metainfo.auditType)?metainfo.auditType:"",
    };
    metaObject[userRole] = createdBy.toString();
    req.headers = req.headers ? req.headers : { session_state: '' };

    let auditObject = {
      system: 'FHIRedSHIP',
      action: action,
      meta: metaObject,
      actionData: [
        {
          name: 'session_state',
          value: req.headers['session_state']
            ? req.headers['session_state']
            : '',
        },
        { name: 'timestamp', value: new Date() },
      ],
      platform: req.headers['platform'] ? req.headers['platform'] : 'web',
      source: 'FHIRedSHIP',
      entity: metainfo.entity,
      documentId: metainfo.documentId ? metainfo.documentId : metainfo.moduleId,
      change: [],
      createdBy: createdBy.toString(),
    };

    console.log('audit json', JSON.stringify(auditObject));

    var auditResponse = await createAudit(auditObject);

    if (auditResponse) {
      return {
        status: true,
      };
    }
  } else {
    return {
      status: false,
    };
  }
};

var uploadFile = async function (req, res) {
  /*upload(req, res, async function (err,result) {
    if (err instanceof multer.MulterError) {
      console.log();
    } else if (err) {
      console.log();
    }
    if(result){
      console.log(result);
    }
    console.log();

    
  })*/
  /*var uplaodPath='..';

var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;
      var newpath = '..' + files.filetoupload.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
        return files.filetoupload.originalFilename;
      });
 });*/
};

const returnUserName = async(email) =>{
let resp = email;
let userData = await userModel.findOne({email:email});
if(userData._id){
  resp = await returnName(userData);
}

return resp

}

module.exports.isFileAllowed = isFileAllowed;
module.exports.returnUserName = returnUserName;
module.exports.returnName = returnName;
module.exports.syncStatus = syncStatus;
module.exports.createMetaObjWithUserName = createMetaObjWithUserName;
module.exports.returnNotificationJson = returnNotificationJson;
module.exports.saveAuditData = saveAuditData;
module.exports.uploadFile = uploadFile;
module.exports.returnIndexOfObject = returnIndexOfObject;
module.exports.getUserDetails = getUserDetails;
module.exports.returnValueByKey = returnValueByKey;
module.exports.compileTemplate = compileTemplate;
module.exports.getSpecificKeyPair = getSpecificKeyPair;
module.exports.convertReferralFhirToSimpleJson =
  convertReferralFhirToSimpleJson;
module.exports.getUser = getUser;
module.exports.convertReferralFhirBundleToSimpleJson =
  convertReferralFhirBundleToSimpleJson;
module.exports.convertConditionFhirBundleToSimpleJson =
  convertConditionFhirBundleToSimpleJson;
module.exports.splitAndReturn = splitAndReturn;
module.exports.returnMappedAssesmentJson = returnMappedAssesmentJson;
module.exports.convertAsssesmentsFhirBundleToSimpleJson =
  convertAsssesmentsFhirBundleToSimpleJson;
