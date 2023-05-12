const logger = require('../config/logger');

const fetchWrapper = require('../config/fetch-wrapper');
const fhirUrl = process.env.FHIR_API_BASE_URL;
const FHIR_Base_URL = process.env.FHIR_Base_URL;

const fhirAuth = process.env.fhirauth;
const notificationService = require('./notification.service');
const constant = require('../config/constants');
const icdCodes = require('../models/icd-codes');

var checkCode =  async function(code, desc){
  let valid = false;
  const codes = await icdCodes.find({});
  if(codes && codes.length !== 0){
    let index = codes.findIndex((x)=> x.desc === desc);
    if(index !== -1){
      if(codes[index].code === code){
        valid = true;
      }
    }
  }
  return valid;
}

var mapdataToConditionJson = async function(_id,patient, recorder, date, qres, need, code, desc){
    
    let mappedObject = {

    "diagnosedOn":date,

    "anticipatedResolution":date,

    "problemType":need,

    "conditionId":qres,

    "patient":patient,

    "activityTime":date,

    "conditionCode":code,

    "conditionLabel":desc,

    "conditionCodeSystem":"http: //hl7.org/fhir/ValueSet/observation-codes",

    "clinicalCode":"active",

    "clinicalLabel":"active",

    "clinicalCodeSystem":"http: //hl7.org/fhir/ValueSet/observation-codes",

    "verificationCode":"active",

    "verificationLabel":"active",

    "verificationCodeSystem":"http: //hl7.org/fhir/ValueSet/observation-codes",

    "recorder":recorder,

    "observation":qres
    }

    return mappedObject;
}



var convertToFhirCondition = async function (data) {
  logger.info(`convertToFhirCondition : service : convertToFhirCondition : received request`);
  try {
    let resp={};
    console.log('data -> ',data);

    const inputData = await this.mapdataToConditionJson(data._id,data.sid, data.user, Date.now(), data.questionnaireresponsId, data.need, data.code, data.desc);
  	
      if(inputData){
        const response = await fetchWrapper.post(
        `${FHIR_Base_URL}/api/condition`,
        inputData
      );
      if(response){
        return response;
       }else{
        return resp;
       }
     }else{
       return resp;
     }
    return resp;
  } catch (e) {
    logger.error(
      `convertToFhirCondition : service : convertToFhirCondition : Error : ${e}`
    );
    throw e;
  }
};


var convertFhirToJsonCondition = async function (data) {
  logger.info(`convertFhirToJsonCondition : service : convertFhirToJsonCondition : received request`);
  try {
    let resp = [];
    for(let i=0;i<data.length;i++){
      let rObj={questionnaireresponsId:data[i].data.identifier[0].value,code:data[i].data.code.coding[0].code,desc:data[i].data.code.coding[0].display,need:data[i].data.category[0].coding[0].display,condId:data[i].data.id};
      resp.push(rObj);
    }
    return resp;
  } catch (e) {
    logger.error(
      `convertFhirToJsonCondition : service : convertFhirToJsonCondition : Error : ${e}`
    );
    throw e;
  }
};

var convertResourceToFhirToBundle = async function (data) {
  logger.info(`convertResourceToFhirToBundle : service : convertResourceToFhirToBundle : received request`);
  try {
    let resp = [];
    let entries=[];

    let basicStructure ={
    "resourceType": "Bundle",
    "id": "2c0112a8-a009-4522-970d-de1284bce691",
    "meta": {
     "lastUpdated": "2022-08-24T12:12:29.459+00:00"
    },
    "type": "searchset",
    "total": data.length,
    "link": [
        {
            "relation": "self",
            "url": ""
        }
    ],
     "entry": []


    }
    for(let i=0;i<data.length;i++){

      if(data[i].questionnaireId && data[i].questionnaireId.name){
      var extension = [
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/instance-name",
        "valueString" : data[i].questionnaireId.name
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/instance-description",
        "valueMarkdown" : "An example of an US Core QuestionnaireResponse that represents questions and selected answers from the PRAPARE questionnaire represented in LOINC (code 93025-5). The example is generated using the LHC-Forms SDC Questionnaire App."
      }
    ];

    data[i].data.meta.extension = extension;

   }

  let resObject={
        // "fullUrl": data[i].data.questionnaire,
         "fullUrl": '',
        "resource": data[i].data
      }
      entries.push(resObject);
     
    }
    basicStructure["entry"]=entries;
    return basicStructure;

  } catch (e) {
    logger.error(
      `convertResourceToFhirToBundle : service : convertResourceToFhirToBundle : Error : ${e}`
    );
    throw e;
  }
};


var convertToFhirReferral = async function (data) {
  logger.info(`convertToFhirReferral : service : convertToFhirReferral : received request`);
  try {
    let resp={};
    console.log('data -> ',data);
    const inputData = await this.mapdataToRefferalJson(data);
    
      if(inputData){
        const response = await fetchWrapper.post(
        `${FHIR_Base_URL}/api/serviceRequest`,
        inputData
      );
      if(response){
        return response;
       }else{
        return resp;
       }
     }else{
       return resp;
     }
    return resp;
  } catch (e) {
    logger.error(
      `convertToFhirReferral : service : convertToFhirReferral : Error : ${e}`
    );
    throw e;
  }
};


var mapdataToRefferalJson = async function(data){
var condition = [];
data.conditions = (data.conditions)?data.conditions:[];
for(var a=0; a < data.conditions.length; a++){
  condition.push(data.conditions[a]._id);
}




let mappedObject = {     
     "id":"916561",
     "performer":data.performer._id,
     "requester":data.requester,
     "patient":data.patient._id,
     "condition":condition,
     "status":(data.status)?data.status.toLowerCase():"",
     "intent":"proposal",
     "priority":"routine",
     "categoryCode":data.categoryCode,
     "categoryLabel":data.categoryLabel,
     "categoryCodeSystem":"http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes",
     "serviceCode":data.interventions.code,
     "serviceLabel":data.interventions.desc,
     "serviceCodeSystem":"http://snomed.info/sct",
     "authoredOn":data.authoredOn   
     }

    return mappedObject;
}

var splitAndReturn = async function (data,key) {
let text='';
let arr=data.split(key);
if(arr[1]){ 
  return arr[1];
}else{
  return text;
}
}

module.exports.splitAndReturn=splitAndReturn;
module.exports.convertToFhirReferral=convertToFhirReferral;
module.exports.mapdataToRefferalJson=mapdataToRefferalJson;
module.exports.convertResourceToFhirToBundle=convertResourceToFhirToBundle;
module.exports.mapdataToConditionJson=mapdataToConditionJson
module.exports.convertToFhirCondition = convertToFhirCondition;
module.exports.convertFhirToJsonCondition = convertFhirToJsonCondition;
module.exports.checkCode = checkCode;