const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
var userDao = require('../dao/user.dao');
const { createAudit } = require('./audit.service');
var helperService = require('./helper.service');
const constant = require('../config/constants');

var get = async function (req, res) {
 const authHeader = { Authorization: referralAuth };
let facility = req.query.facility;
try{
  let data = {}
  data['organization'] = req.query.organization;
  var response = await userDao.getPatients(data,req,res);
  return response;
   
// const userRes = await fetchWrapper.get(
//         `${referralUrl}/api/user/patient?facility=${facility}`,
//         authHeader
//       );
// if(userRes){
 /* createAudit({
    system: 'FHIRedSHIP',
    action: 'PatientListView',
    actionData: [
      { name: 'facility', value: req.query.facility },
      {
        name: 'session_state',
        value: req.headers['session_state']
          ? req.headers['session_state']
          : '',
      },
      { name: 'timestamp', value: new Date() },
    ],
    meta:{},
    platform: 'FHIRedSHIP',
    source: 'FHIRedSHIP',
    entity: 'patient',
    documentId: res.locals.userId || res.locals.adminId,
    change: [],
    createdBy: res.locals.userId || res.locals.adminId,
  });*/
//  return {'status':true,data:userRes};
// }else{
// 	 return {'status':false};
// }
}catch(e){
  return {'status':false,msg:e};
  logger.error(`patient : service : get : Error : ${e}`);
  throw e;
} 
}; 

var getAassessments = async function (req, res) {
 const authHeader = { Authorization: referralAuth };
let sid = req.params.id;
let qPm='';
if(req.params.id){
qPm=qPm+`Patient=`+req.params.id;
}
if(qPm!=''){
qPm=`?`+qPm;
}
try{
  const assesRes = await fetchWrapper.get(
        `${referralUrl}/api/questionnaireresponse${qPm}`,
        authHeader
      );
/*const assesRes = await fetchWrapper.get(
        `${referralUrl}/api/questionnaireresponse?patient/${sid}`,
        authHeader
      );*/
if(assesRes){

  /*
  createAudit({
    system: 'FHIRedSHIP',
    action: 'AssessmentListView',
    actionData: [
      { name: 'sid', value: req.params.id},
      {
        name: 'session_state',
        value: req.headers['session_state']
          ? req.headers['session_state']
          : '',
      },
      { name: 'timestamp', value: new Date() },
    ],
    meta:{},
    platform: 'FHIRedSHIP',
    source: 'FHIRedSHIP',
    entity: 'assessment',
    documentId: res.locals.userId || res.locals.adminId,
    change: [],
    createdBy: res.locals.userId || res.locals.adminId,
  });*/
 return {'status':true,data:assesRes};
}else{
	 return {'status':false};
}
}catch(e){
  logger.error(`patient : service : getAassessments : Error : ${e}`);
  throw e;
}
};

var getQuestionnaireresponse = async function (req, res) {
 const authHeader = { Authorization: referralAuth };
let id = req.params.id;

console.log("in get ques res",referralAuth);
try{
const assesRes = await fetchWrapper.get(
        `${referralUrl}/api/questionnaireresponse/${id}`,
        authHeader
      );
console.log("in get ques res assesRes",assesRes);
if(assesRes){
var msgConfig = constant.msgConfig;

let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
let usrRole =  (userDataSet.role._doc)?userDataSet.role._doc.role:userDataSet.role.role;

var userRole=usrRole.toLowerCase();

let performerName = await helperService.returnName(userDataSet);

    var contextObject = {
      performer:performerName,
      onBehalfOf: '',
      assignedTo: '',
      documentName: '',
    };
     const msgTemplate = msgConfig['assessment_viewed']['en'];
     const auditMessage = await helperService.compileTemplate(msgTemplate,contextObject);
     const msgTemplate_sp = msgConfig['assessment_viewed']['sp'];
     const auditMessage_sp = await helperService.compileTemplate(msgTemplate_sp,contextObject);

      var metaObject={
        "patient" : "",
        "cbo" : "",
        "chw" : "",
        "documentName" : "",
        "module" : "Assessment",
        "moduleId" : assesRes.questionnaireresponse.id,
        "subModule" : "QuestionnaireResponse",
        "subModuleId" : assesRes.questionnaireresponse.id,
        "message_en" : auditMessage,
        "message_sp" : auditMessage_sp
    };
    metaObject[userRole]=userDataSet._id.toString();

let auditObject={
      system: 'FHIRedSHIP',
      action: 'assessment_viewed',
      meta:metaObject,
      actionData: [
        {
          name: 'session_state',
          value: req.headers['session_state']
            ? req.headers['session_state']
            : '',
        },
        { name: 'timestamp', value: new Date() },
      ],
      platform: req.headers['platform'], 
      source: 'FHIRedSHIP', 
      entity: 'QuestionnaireResponse',
      documentId: userDataSet._id.toString(),
      change: [],
      createdBy: userDataSet._id.toString() ,
    };
    console.log('auditObject -',auditObject);
    var auditResponse = await createAudit(auditObject);

 return {'status':true,data:assesRes};
}else{
	 return {'status':false};
}
}catch(e){
logger.error(`patient : service : getQuestionnaireresponse : Error : ${e}`);
  throw e;
}
};

module.exports.getQuestionnaireresponse = getQuestionnaireresponse;
module.exports.getAassessments = getAassessments;
module.exports.get = get;
