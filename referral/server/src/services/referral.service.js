const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const referral = require('../models/referral');
const fhirUrl = process.env.FHIR_API_BASE_URL;
const fhirAuth = process.env.fhirauth;
const constant = require('../config/constants');
var userService = require('./user.service');
var helperService = require('./helper.service');

var get = async function (req, res, next) {
  try {
  	//let object={'user':req.params.id};
    let object={};
    object['$or'] = [];
    object['$or'].push({'user':req.params.id});
    object['$or'].push({'cbo':req.params.id});
    if(req.query.sid){
      object['sid'] = req.query.sid;
    }
   var referralResponse = await referral.find(object).sort({"updatedAt":-1});
    return referralResponse;
  } catch (e) {
return [];
  }
};

 
 
var save = async function (object) {
  try {
    const referralResponse = await referral.create(object);
      return referralResponse;
  } catch (e) {
    var error = 'Failed to save referral';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};


var getReferrals = async function (req, res, next) {
  try {
    let query={};
    let userQuery={};
    if(req.params && req.params.id){
      query['_id']=req.params.id;
    }
    if(req.query){
   /*   for (const [key, value] of Object.entries(qPm)) {

       console.log(`${key}: ${value}`);*/
       let refId='';
       if(req.query.requester_type=='Patient'){
         refId=(req.query.patient)?req.query.patient:req.query.id;
          userQuery['sid']=refId;
       }else if(req.query.requester_type=='Cbo' || req.query.requester_type=='cbo-organization'  || req.query.requester_type=='Chw' || req.query.requester_type=='chw-organization'){
         refId=req.query.id;
         userQuery['uuid']=refId;
       }

    /*   if(req.query.requester_type=='Patient'){
         userQuery['_id']=refId;
       }else if(req.query.requester_type=='Cbo'){
         userQuery['cbo']=refId;
       }else{
         userQuery['user']=refId;
       }*/

       let userId=''; 
       console.log("userQuery-->",userQuery);
      var user = await userService.getUser(userQuery);
      if(user){
        userId=user._id?user._id.toString():'';
      }

      if(req.query.requester_type=='Patient'){
         query['sid']=userId;
       }else if(req.query.requester_type=='Cbo' || req.query.requester_type=='cbo-organization'){
         query['cbo']=userId;
       }

       else if(req.query.requester_type=='Chw' || req.query.requester_type=='chw-organization'){
         query['user']=userId;
       }
     
  }

  const page = req.query.page?req.query.page:1;
  const limit = 10;
  const skip = page ? (Number(page) - 1) * limit : 0;
  if(Object.keys(query).length == 0){
   return {
        count:0,
        data:[]
      };
  }

 var referralResponseCount = await referral.count(query);

    var referralResponse = await referral.find(query).skip(skip)
      .limit(limit).sort({ "updatedAt": -1 });
        let respdata={
        count:referralResponseCount,
        data:referralResponse
      };
    return respdata;
  } catch (e) {
return {
        count:0,
        data:[]
      };
  }
};

var update = async function (fromObject,updateObject) {
  logger.info(`referral : service : update : received request`);
  try {
    const response = await referral.findOneAndUpdate(fromObject,updateObject);
    return response;
  } catch (e) {
    logger.error(`referral : service : update : Error : ${e}`);

    throw e;
  }
};

var findOne = async function (query) {
  logger.info(`referral : service : findOne : received request`);
  try {
    const response = await referral.findOne(query);
    return response;
  } catch (e) {
    logger.error(`referral : service : findOne : Error : ${e}`);

    throw e;
  }
};

var fillRefIds = async function (records) {
  try {
  if(records.length>0){
    for(var i=0;i<records.length;i++){
      try{
       var patientId= await helperService.splitAndReturn(records[i].data.subject.reference,'Patient/');
       var cboId= await helperService.splitAndReturn(records[i].data.performer[0].reference,'Organization/');
       var chwId= await helperService.splitAndReturn(records[i].data.requester.reference,'Practitioner/');

       var patientResponse = await userService.getUser({"_id":patientId});
       var chwResponse = await userService.getUser({"_id":chwId});
       var cboResponse = await userService.getUser({"_id":cboId});
       let patientSid=patientResponse.sid?patientResponse.sid:'';
       let cboUuid=cboResponse.uuid?cboResponse.uuid:'';
       let chwUuid=chwResponse.uuid?chwResponse.uuid:'';
       records[i].data.subject.reference='Patient/'+patientSid;
       records[i].data.performer[0].reference='Organization/'+cboUuid;
       records[i].data.requester.reference='Practitioner/'+chwUuid;
       }catch(error){
         console.log('user info not found');
       }
    }

   return records;
  }else{
    return records;
  }
    
   return records;
  } catch (e) {
    return [];
  }
};

var getReferral = async function (req, res, next) {
  try {
    let object={'_id':req.params.id};
   var referralResponse = await referral.findOne(object);
    return referralResponse;
  } catch (e) {
return [];
  }
};

module.exports.findOne = findOne;
module.exports.getReferral = getReferral;
module.exports.fillRefIds = fillRefIds;
module.exports.update = update;
module.exports.get = get;
module.exports.getReferrals = getReferrals;
module.exports.save = save;