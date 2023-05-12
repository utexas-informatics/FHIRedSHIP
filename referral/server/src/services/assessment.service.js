const logger = require('../config/logger');

const fetchWrapper = require('../config/fetch-wrapper');

const assessments = require('../models/assessment');

const fhirUrl = process.env.FHIR_API_BASE_URL;

const fhirAuth = process.env.fhirauth;

/*var getById = async function (req, res, next,resId) {
  logger.info(`getById : service : getById : received request`);
  try {
    var respId='';
    if(resId){
      respId=resId;
    }else{
      respId=req.params.id;
    }
    const assessment = await assessments.findById(respId);

    if (assessment) {
      const fhirId = assessment.fhirId;
      const authHeader = { Authorization: fhirAuth };
      // const assessmentData = await fetchWrapper.get(
      //   `${fhirUrl}/Questionnaire/${fhirId}`,
      //   authHeader
      // );
      const assessmentData = assessment.data;
      return assessmentData;
    } else {
      return assessment;
    }
  } catch (e) {
    logger.error(`assessment : service : getById : Error : ${e}`);

    throw e;
  }
};*/
var getById = async function (req, res, next,resId) {
  logger.info(`getById : service : getById : received request`);
  try {
    var respId='';
    if(resId){
      respId=resId;
    }else{
      respId=req.params.id;
    }
    const assessment = await assessments.findById(respId);

    if (assessment) {
      const fhirId = assessment.fhirId;
      const authHeader = { Authorization: fhirAuth };
      // const assessmentData = await fetchWrapper.get(
      //   `${fhirUrl}/Questionnaire/${fhirId}`,
      //   authHeader
      // );
      const assessmentData = assessment.data;


     return assessmentData;
    } else {
      return assessment;
    }
  } catch (e) {
    logger.error(`assessment : service : getById : Error : ${e}`);

    throw e;
  }
};

var get = async function (req) {
  logger.info(`getById : service : get : received request`);

  try {
    const assessment = await assessments.find({}).sort({"createdAt":-1});
    return assessment;
  } catch (e) {
    logger.error(`assessment : service : getById : Error : ${e}`);

    throw e;
  }
};

module.exports.getById = getById;
module.exports.get = get;
