const logger = require('../config/logger');

const fetchWrapper = require('../config/fetch-wrapper');

const questionnaireresponses = require('../models/questionnaireresponse');

const fhirUrl = process.env.FHIR_API_BASE_URL;

const fhirAuth = process.env.fhirauth;
const notificationService = require('./notification.service');
const constant = require('../config/constants');
var userService = require('./user.service');

var getById = async function (req, res, next) {
  try {
    var questionnaireresponse = await questionnaireresponses.findById(
      req.params.id
    ).populate('questionnaireId','name');
    return questionnaireresponse;
  } catch (e) {
    var error = 'Failed to get by id questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}; 

var getByPatId = async function (req) {
  logger.info(`getById : service : getByPatId : received request`);

  try {
    let object = {};
    if (req.params.id) {
      const patQuery={'sid':req.params.id};
      var pat = await userService.getUser(patQuery);
       object = { patId: pat ?pat._id.toString():'' };
    }
    const questionnaireresponse = await questionnaireresponses.find(object).populate('questionnaireId','name');
    return questionnaireresponse;
  } catch (e) {
    logger.error(
      `questionnaireresponses : service : getByPatId : Error : ${e}`
    );

    throw e;
  }
};

var save = async function (req, res, next) {
  try { 
    console.log('q save ---',req.body);
    let object = req.body;
    let questionnaireUri = fhirUrl + '/Questionnaire/' + object.fhirId;
    object.data['questionnaire'] = questionnaireUri;
    delete object.fhirId; 
    const questionnaireresponse = await questionnaireresponses.create(object);
    let fromObject={_id:questionnaireresponse._id};
    qresData=questionnaireresponse.data;
    qresData['id']=questionnaireresponse._id.toString();
    qresData['authored']=questionnaireresponse.createdAt;
    let updateObject = {data:qresData};
    var user = await userService.getUser({'_id':object.assignedTo});
    var pat = await userService.getUser({'_id':object.patId});
    let assignedTo = user && user.uuid?user.uuid:'';
    const questionnaireUpdateResponse = await questionnaireresponses.findOneAndUpdate(fromObject,updateObject);
    if (questionnaireresponse) {
   const notification = Object.assign({},constant.notification);
      notification.meta.assignedTo= assignedTo;
      notification.meta.onBehalfOf='';
      notification.meta.performer=object.sid;
      notification.meta.documentName='';
      notification.sender.id = object.sid;
      notification.sender.type = 'Patient';
      notification.type = 'assessment_filled';
      notification.meta.module = 'Assessment';
      notification.meta.moduleId = object.questionnaireId;
      notification.meta.subModule = 'QuestionnaireResponse';
      notification.meta.subModuleId = questionnaireresponse._id;
      notification.receiver = [{ id: assignedTo, type: 'CHW' }];
      console.log("notification-->",notification);
      notificationService.callBackRequest(notification);
      return questionnaireresponse;
    }
  } catch (e) {
    var error = 'Failed to save questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var update = async function (req, res, next) {
  try { 
    console.log('q save ---',req.body);
    let object = req.body;
    // let questionnaireUri = fhirUrl + '/Questionnaire/' + object.fhirId;
    // object.data['questionnaire'] = questionnaireUri;
    //delete object.fhirId; 
    const questionnaireresponse = await questionnaireresponses.findOne({"_id":object.rid});
    //let fromObject={_id:questionnaireresponse._id};
    let qresData= questionnaireresponse && questionnaireresponse.data?questionnaireresponse.data:null;
    // qresData['id']=questionnaireresponse._id.toString();
    // qresData['authored']=questionnaireresponse.createdAt;
    qresData.item = object.data.item;
    let updateObject = {data:qresData};
    var user = await userService.getUser({'_id':object.assignedTo});
    var pat = await userService.getUser({'_id':object.patId});
    let assignedTo = user && user.uuid?user.uuid:'';
    const questionnaireUpdateResponse = await questionnaireresponses.findByIdAndUpdate(object.rid,updateObject,{
      new: true,
    });
    if (questionnaireresponse) {
      const notification = Object.assign({},constant.notification);
      notification.meta.assignedTo= assignedTo;
      notification.meta.onBehalfOf='';
      notification.meta.performer=object.sid;
      notification.meta.documentName='';
      notification.sender.id = object.sid;
      notification.sender.type = 'Patient';
      notification.type = 'assessment_filled';
      notification.meta.module = 'Assessment';
      notification.meta.moduleId = object.questionnaireId;
      notification.meta.subModule = 'QuestionnaireResponse';
      notification.meta.subModuleId = questionnaireresponse._id;
      notification.receiver = [{ id: assignedTo, type: 'CHW' }];
      console.log("notification-->",notification);
      notificationService.callBackRequest(notification);
      return questionnaireresponse;
    }
  } catch (e) {
    var error = 'Failed to update questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getQuestionnaiReresponses = async function (req) {
  logger.info(`getQuestionnaiReresponses : service : getQuestionnaiReresponses : received request`);
 let object = {};
 let patId = (req.query.sid)?req.query.sid:req.query.id;
 let page  = (req.query.page)?Number(req.query.page):"";
 let limit  = (req.query.limit)?Number(req.query.limit):"";
  let skip = "";
 if(page !== "" && limit !== ""){
   skip = (page-1)*limit;
 }


 if(patId == '' || patId == undefined || patId == null){
  patId = (req.query.patient)?req.query.patient:"";
 }
 var pat = await userService.getUser({'sid':patId});
  if(req.query && req.query.requester_type && req.query.requester_type!='Patient'){
   let userQuery={'uuid':req.query.id};
      var user = await userService.getUser(userQuery);
     
      if(user){
        let userId=user._id.toString();
        object['user']=userId;

        object['patId']=pat?pat._id.toString():'';

      }
  }else{
  object['patId']=pat?pat._id.toString():'';
  }
  try {
    if(Object.keys(object).length !== 0){
      const count = await questionnaireresponses.count(object);
       let questionnaireresponse;
      if(page == ""){
       questionnaireresponse = await questionnaireresponses.find(object).sort({'createdAt':-1}).populate('questionnaireId','name');
      }
      else{
      questionnaireresponse = await questionnaireresponses.find(object).skip(skip).limit(limit).sort({'createdAt':-1}).populate('questionnaireId','name');
      }

    
      return {data:questionnaireresponse,status:true,count:count};
    }
    return {data:[],count:0,status:true};
    
  } catch (e) {
    logger.error(
      `questionnaireresponses : service : getQuestionnaiReresponses : Error : ${e}`
    );

    throw e;
  }
};

module.exports.update = update;
module.exports.getQuestionnaiReresponses = getQuestionnaiReresponses;
module.exports.save = save;
module.exports.getById = getById;
module.exports.getByPatId = getByPatId;
