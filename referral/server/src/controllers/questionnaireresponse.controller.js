var questionnaireresponseService = require('../services/questionnaireresponse.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');
var assessmentService = require('../services/assessment.service');
var helperService = require('../services/helper.service');
var conditionService = require('../services/condition.service');
var userService = require('../services/user.service');
const auditService = require('../services/audit.service');
 
var getById = async function (req, res, next) {
  try {
    var questionnaireresponse = await questionnaireresponseService.getById(req, res);
  
      var extension = [
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/instance-name",
        "valueString" : questionnaireresponse.questionnaireId.name
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/instance-description",
        "valueMarkdown" : "An example of an US Core QuestionnaireResponse that represents questions and selected answers from the PRAPARE questionnaire represented in LOINC (code 93025-5). The example is generated using the LHC-Forms SDC Questionnaire App."
      }
    ];
      
    questionnaireresponse.data.meta.extension = extension;

    let aid=questionnaireresponse.questionnaireId._id;
    let questionnaireUrl = questionnaireresponse.data.questionnaire;
      
      // var assessment = await assessmentService.getById(req, res, next, aid);

      // var conditionResponse = await conditionService.getConditionsByResp(req, res);
      // var helperResp = await helperService.convertFhirToJsonCondition(conditionResponse);
     let result={'questionnaireresponse':questionnaireresponse.data}
    res.json(result);
  } catch (e) {
    var error = 'Failed to get by id questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getByPatId = async function (req, res, next) {
  try {
    var questionnaireresponse = await questionnaireresponseService.getByPatId(req, res);
    res.json(questionnaireresponse);
  } catch (e) {
    var error = 'Failed to get questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
}; 
 
var save = async function (req, res, next) {
  try {
    let uuid=req.body.user;
    req.body.assignedTo=uuid;
    req.body.onBehalfOf='';
    //req.body.performer=dobject.sid;
    let userQuery={'uuid':uuid};
    //var user = await userService.getUser(userQuery);
    var user = req.body.user;
    let patQuery={'sid':req.body.sid};
    var pat = await userService.getUser(patQuery);
    if(pat){
      req.body.patId=pat._id.toString();
    }
    if(user){
      req.body.user= user;
      req.body.data.source={
        "reference": "Practitioner/"+req.body.user
      }
    //   req.body.user=user._id.toString();
    //   req.body.data.source={
    //   "reference": "Practitioner/"+req.body.user
    // }
    }else{
      req.body.user = '';
    }

    var questionnaireresponse = await questionnaireresponseService.save(req, res);
    
      /*let auditObject={
        action:'QuestionnaireResponseSaved',
        identifier:'chw',
        identifierValue:uuid,
        entity:'QuestionnaireResponse',
        documentId:questionnaireresponse._id.toString(),
        createdByType:'patient',
        createdById:req.body.sid
      };

      auditService.auditCallBackRequest(auditObject);*/

    res.json(questionnaireresponse);
  } catch (e) {
    var error = 'Failed to save questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, error)
    );
  }
};

var updateRes = async function (req, res, next) {
  try {
    let uuid=req.body.user;
    req.body.assignedTo=uuid;
    req.body.onBehalfOf='';
    let userQuery={'uuid':uuid};
    var user = req.body.user;
    let patQuery={'sid':req.body.sid};
    var pat = await userService.getUser(patQuery);
    if(pat){
      req.body.patId=pat._id.toString();
    }
    if(user){
      req.body.user= user;
      req.body.data.source={
        "reference": "Practitioner/"+req.body.user
      }
    }else{
      req.body.user = '';
    }

    var questionnaireresponse = await questionnaireresponseService.update(req, res);

    res.json(questionnaireresponse);
  } catch (e) {
    var error = 'Failed to save questionnaireresponse';
    next(
      errorResponse.build(constants.error.internalServerError, error, error)
    );
  }
};

var getQuestionnaiReresponses = async function (req, res, next) {
  try {
    var questionnaireresponse = await questionnaireresponseService.getQuestionnaiReresponses(req, res);
     var helperResp = await helperService.convertResourceToFhirToBundle(questionnaireresponse.data);
    res.json({data:helperResp,status:true,count:questionnaireresponse.count});
  } catch (e) {
    var error = 'Failed to get getQuestionnaiReresponses';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.updateRes = updateRes;
module.exports.getQuestionnaiReresponses = getQuestionnaiReresponses;
module.exports.save = save;
module.exports.getById = getById;
module.exports.getByPatId = getByPatId;