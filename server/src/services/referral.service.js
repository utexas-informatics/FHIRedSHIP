const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
var helperService = require('./helper.service');
var refModal = require('../models/referral');
var mapModal = require('../models/mapping');
const constant = require('../config/constants');
var refDao = require('../dao/referral.dao');

var getReferrals = async function (req, res) {
  const authHeader = { Authorization: referralAuth };
  let queryParameterString = '';
  let isAccountLinked = false;
  const mappingWithUserRole = constant.parameterMappingWithUserRole;
  const query = {};
  const role = req.query.requester_type;
  if (req.query) {
      const userData = await helperService.getUserDetails({
        _id: req.query.id,
      });

      if(userData.organization && userData.organization.toString() !== req.decoded.organization.toString() && req.decoded.role.role !== 'Patient'){
       res.send({status:false,data:[],error:"access_denied"});
      }
      else if(req.decoded.role.role === 'Patient' && userData._id.toString() !== req.decoded._id.toString()){
      res.send({status:false,data:[],error:"access_denied"});
      }
      else{

      if (userData) {
        if (role == 'Patient') {
         req.query.id = (userData.sid)?userData.sid:"";
        }
        else{
           req.query.id = (userData.uuid)?userData.uuid:"";
        }
      }
    const qParam = req.query;

    if(req.query.id && req.query.id != ""){
     isAccountLinked = true;
    }
    for (const [key, value] of Object.entries(qParam)) {
      console.log(`${key}: ${value}`);
      if (qParam[key] && qParam[key] != null && qParam[key] != '') {
        let prefix = '&';
        if (queryParameterString == '') {
          prefix = '?';
        }
           if (mappingWithUserRole[key]) {
            queryParameterString =
              queryParameterString +
              prefix +
              mappingWithUserRole[key] +
              `=` +
              value;
          }

      }
    }
    if (req.query.page) {
      queryParameterString = queryParameterString;
    }
    }
  }
  if(referralUrl && isAccountLinked === true){
    try {
    const resp = await fetchWrapper.get(
      `${referralUrl}/api/referral${queryParameterString}`,
      authHeader
    );
    if (resp) {
      return { data: resp };
    } else {
      return { data: [] };
    }
  } catch (err) {
    return { data: [] };
  }
  }
  else{
    return { data: [] };
  }
};

var returnStatus = async function (query) {
  try {
    const resp = await refDao.findOne(query);
    return resp;
  } catch (e) {
    throw e;
  }
};

var getReferral = async function (req, res) {
let query = {};
let mapQuery = {}
query['refId'] = req.params.id;
query['$or'] = [];

 if(req.decoded && req.decoded.role.role == 'Patient'){
  mapQuery['uid'] = req.decoded.sid;
 }
 else{
 
  if(req.decoded.subs && req.decoded.subs != ''){
  mapQuery['$or'] = [{uid:req.decoded.uuid},{uid:Buffer.from(req.decoded.subs.rs,'base64').toString('binary')}];
  }
  else{
   mapQuery['uid'] = req.decoded.uuid;
  }
 }
 
 let mapData = await mapModal.find(mapQuery);
 
 if(mapData.length > 0){

 for(var a=0; a < mapData.length; a++){
 if(req.decoded.role.role == 'Patient'){
 query['$or'].push({'patient':mapData[a].linkedWith});
 }
 else if(req.decoded.role.role == 'Chw' || req.decoded.role.role == 'chw-organization'){
 query['$or'].push({'chw':mapData[a].linkedWith});
 }
 else{
 query['$or'].push({'cbo':mapData[a].linkedWith});
 }
}
}



 // if(req.decoded.role.role == 'Patient'){
 //  query['patient'] = req.decoded._id.toString();
 // }
 // else if(req.decoded.role.role == 'Chw'){
 //  query['chw'] = req.decoded._id.toString();
 // }
 // else{
 //  if(req.decoded.adminId && req.decoded.adminId._id){
 //    query['$or'] = [{'cbo':req.decoded._id.toString()},{'cbo':req.decoded.adminId._id.toString()}];
 //  }
 //  else{
 //    query['cbo'] = req.decoded._id.toString();
 //  }
  
 // }
  

 let refData = await refModal.findOne(query); 

 if(refData == undefined){
  res.send({status:false,data:[],error:"access_denied"});
 }
 else{
  if(referralUrl && referralUrl != ""){
    try {
    const authHeader = { Authorization: referralAuth };
    const resp = await fetchWrapper.get(
      `${referralUrl}/api/referral/${req.params.id}`,
      authHeader
    );
    return resp;
  } catch (e) {
    throw e;
  }
  }
  else{
     return {};
  }


 }
  


};

var save = async function (data) {
  try {
    const resp = await refDao.save(data);
    return resp;
  } catch (e) {
    throw e;
  }
};

var update = async function (data) {
  try {
    const resp = await refDao.update(data);
    return resp;
  } catch (e) {
    throw e;
  }
};
var sendCallbackToReferral = async function(data){
  try {
    const authHeader = { Authorization: referralAuth };
    const resp = await fetchWrapper.post(
      `${referralUrl}/api/callback`,data,
      authHeader
    );
    return resp;
  } catch (e) {
    throw e;
  }

}
module.exports.sendCallbackToReferral = sendCallbackToReferral;
module.exports.returnStatus = returnStatus;
module.exports.update = update;
module.exports.save = save;
module.exports.getReferral = getReferral;
module.exports.getReferrals = getReferrals;
