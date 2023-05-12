const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const constants = require('../config/constants');
const userModel = require("../models/users");
const settingDao = require("../dao/settings.dao");
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
const { createAudit } = require('./audit.service');
const mappingService = require('./mapping.service');
const userService = require('./user.service');
var helperService = require('./helper.service');
const { v4: uuidv4 } = require('uuid');
const orgModal = require("../models/organization");
const mongoose = require("mongoose");
var subscribeCalendly = async function(req,res,userData){
let token = userData.appointmentData.access_token;

const authHeader = { Authorization: 'Bearer '+token };
let subscriptionData = {};
subscriptionData['events'] = [
     "invitee.created",
     "invitee.canceled"
   ];
subscriptionData['organization'] = userData.appointmentData.current_organization;
subscriptionData['user'] = userData.appointmentData.uri;
subscriptionData['scope'] = "organization";
subscriptionData['signing_key'] = "5mEzn9C-I28UtwOjZJtFoob0sAAFZ95GbZkqj4y3i0I";
subscriptionData['url'] = `${constants.baseUrl}/api/appointment/callback`;  
  try {
  
  if(constants && constants.calendllyBaseUrl){
    try {

    const resp = await fetchWrapper.post(
      `${constants.calendllyBaseUrl}/webhook_subscriptions`,subscriptionData,
      authHeader
    );
    if (resp.resource) {
    return { status:true,msg:"",data:resp};
    } else {
      return { status:false,msg:resp.message,data:{}};
    }
  } catch (err) {
    return { status:false,msg:err,data:{} };
  }
  }
  else{
    return { status:false,msg:"Calendly url not configured",data:{}};
  }


   } catch (e) {
     return { status:false,msg:e,data:{}};
    logger.error(`settings : service : Enable Calendly : Error : ${e}`);
    throw e;
  }


}


var updateUserWithAppointmentData = async function(req,res,data){
  try {
  let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
 let resp = await userModel.findByIdAndUpdate(userDataSet._id,data,{new: true});
 return {status:true,msg:"",data:resp};
  
 }catch(err){
 return {status:false,error:err,msg:err,data:{}};
 }

}


var createNewCalendlyAccount = async function(req,res,authHeader,token,isSettingEnable,setting){
try {
  if(constants && constants.calendllyBaseUrl){
    try {
    const resp = await fetchWrapper.get(
      `${constants.calendllyBaseUrl}/users/me`,
      authHeader
    );

    let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
    if (resp && resp.resource) {
    resp.resource.access_token = token;
    resp.resource.disable = false;
    let userData = {appointmentData:resp.resource};
    let subscribeResp = await subscribeCalendly(req,res,userData);
    if(subscribeResp.data && subscribeResp.data.resource){
    let splitArr = (subscribeResp.data.resource.uri)?subscribeResp.data.resource.uri.split("/webhook_subscriptions/"):[];
    if(splitArr.length > 0){
    let web_hook_id = splitArr[splitArr.length -1];
    userData.appointmentData.web_hook_id = web_hook_id;
    }

    }
    else{

    return { status:false,msg:subscribeResp.msg};

    }

    let userResp =  await updateUserWithAppointmentData(req,res,userData);

    let performerUser = await helperService.returnName(userDataSet);
    
    var contextObject = {
      performer: performerUser
    };
    let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role.toLowerCase():userDataSet.role.role.toLowerCase();

    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.module="account_link_with_calendly";
    metaInfo.documentId=userDataSet._id;
    metaInfo.action="account_link_with_calendly";
    metaInfo.entity="user";
    metaInfo.auditType="FHIRedSHIP";
    if(userResp.status == true){
    
    if(isSettingEnable == true){
    contextObject.prevCalendlyAccount = (setting.meta)?setting.meta.linkWith:"";
    contextObject.documentName = (resp.resource)?resp.resource.email:"";
    metaInfo.module="account_link_changed_with_calendly";
    metaInfo.action="account_link_changed_with_calendly";
    let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);
    let reqData = {
        id:setting._id,
        body:{
        meta:{linkWith:resp.resource.email} 
        }
       }
  let settingResp = await settingDao.update(req,res,reqData);


    return { status:true,msg:"",data:{}};
    }

    else{
     let reqData = {
        body:{
        type:"calendly",
        userId:userDataSet._id.toString(),
        meta:{linkWith:resp.resource.email} 
        }
       }
      let settingResp = await settingDao.save(reqData,res);
 
      if(settingResp.status == true){
      contextObject.fsAccount = userDataSet.email;
      contextObject.documentName = (resp.resource)?resp.resource.email:"";
      let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);
      return { status:true,msg:"",data:settingResp};
      }
      else{
       return { status:true,msg:"Setting not saved due to some error"};
      }

    }

 
 
    }
    else{
    return { status:false,msg:userResp.msg};

    }
    } 
    else {
      return { status:false,msg:resp.message};
    }
  } catch (err) {
    return { status:false,msg:err };
  }
  }
  else{
    return { status:false,msg:"Calendly url not configured" };
  }


   } catch (e) {
     return { status:false,msg:e };
    logger.error(`settings : service : Enable Calendly : Error : ${e}`);
    throw e;
  }

}


var updateCalendlySetting = async function(req,res,authHeader,setting){
 try {
 let reqData = {
    id:setting._id,
    body:{
    isEnable:true  
    }
  }
  let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;

  let userData = await userModel.findOne({"_id":userDataSet._id});
    let token = userData._doc.appointmentData.access_token;
    let web_hook_id = userData._doc.appointmentData.web_hook_id;
    let subscribeResp = await subscribeCalendly(req,res,userData);

    if(subscribeResp.data && subscribeResp.data.resource){
    let splitArr = (subscribeResp.data.resource.uri)?subscribeResp.data.resource.uri.split("/webhook_subscriptions/"):[];
    if(splitArr.length > 0){
    let web_hook_id = splitArr[splitArr.length -1];
    userData.appointmentData.web_hook_id = web_hook_id;
    }
    let data={};
    data["appointmentData"] = userData.appointmentData;
    data["appointmentData"].disable = false;
    let userResp = await updateUserWithAppointmentData(req,res,data);
    if(userResp.status == true){
    let settingResp = await settingDao.update(req,res,reqData);
     if(settingResp.status == true){
    
    let performerUser = await helperService.returnName(userDataSet);
    
    var contextObject = {
      performer: performerUser,
      documentName: (setting.meta)?setting.meta.linkWith:""
    };
    let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role.toLowerCase():userDataSet.role.role.toLowerCase();

    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.module="enable_account_link_with_calendly";
    metaInfo.documentName=(setting.meta)?setting.meta.linkWith:"";
    metaInfo.documentId=userDataSet._id;
    metaInfo.action="enable_account_link_with_calendly";
    metaInfo.entity="user";
    metaInfo.auditType="FHIRedSHIP";
    let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);
    return {"status":true,data:settingResp};
     }
     else{
      return {"status":false,msg:"Setting not updated"};
     }

     }
     else{
     return { status:false,msg:"Setting not updated"};
     }
    }
    

    else{
    return { status:false,msg:subscribeResp.msg};

    }
 
  } catch (e) {
     return { status:false,msg:e };
    logger.error(`settings : service : updateCalendlySetting : Error : ${e}`);
    throw e;
  }

}




var enableCalendly = async function(req,res){
  logger.info(`settings : service : Enable Calendly: received request`);
  let resp;
  let token = req.body.token;
  let setting = req.body.setting;
  const authHeader = { Authorization: 'Bearer '+token };
  if(setting && !setting._id){
   resp = await createNewCalendlyAccount(req,res,authHeader,token,false,{}); 
  }
  else{
   resp = await updateCalendlySetting(req,res,authHeader,setting);

  }
  return resp;
}



var accountChange = async function(req,res){
  logger.info(`settings : service : Account Change Calendly: received request`);
  let resp;
  let token = req.body.token;
  let setting = req.body.setting;
  const authHeader = { Authorization: 'Bearer '+token };
  let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
  let userData = await userModel.findOne({"_id":userDataSet._id});
  let oldtoken = userData.appointmentData.access_token;
  let web_hook_id = userData.appointmentData.web_hook_id;
  
  resp = await createNewCalendlyAccount(req,res,authHeader,token,true,setting);
  
  if(resp.status == true){
   let unsubscribeResp = await unsubscribe(oldtoken,web_hook_id);
  //resp = await createNewCalendlyAccount(req,res,authHeader,token,true,setting);
  }

return resp;
}

var unsubscribe = async function(token,web_hook_id){
const authHeader = { Authorization: 'Bearer '+token };

  if(constants && constants.calendllyBaseUrl){
    try {
    const resp = await fetchWrapper.delete(
      `${constants.calendllyBaseUrl}/webhook_subscriptions/${web_hook_id}`,
      authHeader
    );

   if(resp && resp.status == 204){
    return {status:true,data:{},"msg":""};
   }

  }catch(err){
    

  }
}
else{
   return { status:false,msg:"Calendly url not configured" };
}

}

var disableCalendly = async function(req,res){
  logger.info(`settings : service : Disable Calendly: received request`);
  let resp;
  let setting = req.body.setting;
  if(setting && setting._id != undefined &&  setting._id != null){
  let reqData = {
    id:setting._id,
    body:{
    isEnable:false  
    }
  }

  // if(settingResp.status == true){

    let data={};
    let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
    let userData = await userModel.findOne({"_id":userDataSet._id});
    data["appointmentData"] = userData.appointmentData;
    data["appointmentData"].disable = true;
    let userResp = await updateUserWithAppointmentData(req,res,data);
    if(userResp.status == true){
    let token = userResp.data.appointmentData.access_token;
    let web_hook_id = userResp.data.appointmentData.web_hook_id;
    let unsubscribeResp = await unsubscribe(token,web_hook_id);
    let settingResp = await settingDao.update(req,res,reqData);
    if(settingResp.status == true){

    let performerUser = await helperService.returnName(userDataSet);
    
    var contextObject = {
      performer: performerUser,
      documentName: (setting.meta)?setting.meta.linkWith:""
    };
    let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role.toLowerCase():userDataSet.role.role.toLowerCase();

    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.module="disable_account_link_with_calendly";
    metaInfo.documentName=(setting.meta)?setting.meta.linkWith:"";
    metaInfo.documentId=userDataSet._id;
    metaInfo.action="disable_account_link_with_calendly";
    metaInfo.entity="user";
    metaInfo.auditType="FHIRedSHIP";
    let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);
    return {status:true,msg:"",data:settingResp};
    }
    else{
      return { status:false,msg:"Setting not updated"};
    }

 
    }
    else{
    return { status:false,msg:"Setting not updated"};

    }


    // }
    // else{
    //   resp = {"status":false,msg:"Setting not updated"};
    // }

    }
    return resp;


}

var get = async function(req,res){
  logger.info(`settings : service : Get Settings: received request`);
  try {
    var responseData = await settingDao.get(req,res);
    return responseData;
   } catch (e) {
    logger.error(`message : service : Get Settings : Error : ${e}`);
    throw e;
  }


}




var enableRefLink = async function(req,res,settingData,authHeader){
   try {
  let setting = settingData;
  if(setting && setting._id != undefined &&  setting._id != null){
  let reqData = {
    id:setting._id,
    body:{
    isEnable:true  
    }
  }
    let data={};
    let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
    let userResp = await userModel.findByIdAndUpdate(userDataSet._id,{"uuidEnable":true});
    if(userResp){
    let settingResp = await settingDao.update(req,res,reqData);
    if(settingResp.status == true){

    let performerUser = await helperService.returnName(userDataSet);
    
    var contextObject = {
      performer: performerUser,
      documentName: (setting.meta)?setting.meta.linkWith:""
    };
   let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role.toLowerCase():userDataSet.role.role.toLowerCase();

    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.module="enable_account_link_with_referral";
    metaInfo.documentName=(setting.meta)?setting.meta.linkWith:"";
    metaInfo.documentId=userDataSet._id;
    metaInfo.action="enable_account_link_with_referral";
    metaInfo.entity="user";
    metaInfo.auditType="FHIRedSHIP";
   let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);



    return { status:true,msg:"",data:settingResp,uuidEnable:true,linkId:userResp.uuid};
    }
    else{
    return { status:false,msg:"Setting not updated"};
    }

    }
    else{
    return { status:false,msg:"Setting not updated"};
    }


    }

 }catch(err){
  return { status:false,msg:err};
  logger.error(`message : service : disable referral account : Error : ${err}`);
  throw e;

 }



}



var createReferralLink = async function(req,res,curEmail,refEmail,facility,settingData,authHeader){
const curuuid = uuidv4();
  let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
  const userRes = await fetchWrapper.post(
    `${referralUrl}/api/user/link`,
    { email: refEmail, type: 'user',UUID:curuuid, facility:facility },
    authHeader
  );
  let linkId = '';
  if (userRes && userRes.uuid) {
    linkId = curuuid;
    const user = await userModel.findOneAndUpdate(
      {
        _id: userDataSet._id,
      },
      {
        $set: {
          uuid: linkId,
          uuidLinked: true,
          uuidEnable:true
        },
        updatedAt: new Date(),
        updatedBy: res.locals.userId,
      },
      { new: true }
    );

  await mappingService.save({
      linkedWith: userRes._id,
      uid: linkId
    });

  let reqData = {
        body:{
       type:"referral_account",
       isEnable:true,
       userId:userDataSet._id.toString(),
       meta:{linkWith:refEmail} 
        }
    }

  if (user) {

    let performerUser = await helperService.returnName(user);
    
    var contextObject = {
      performer: performerUser,
      documentName: refEmail,
      fsAccount:userDataSet.email
    };



   let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role.toLowerCase():userDataSet.role.role.toLowerCase();

    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.module="account_link_with_referral";
    metaInfo.documentName=refEmail;
    metaInfo.documentId=userDataSet._id;
    metaInfo.action="account_link_with_referral";
    metaInfo.entity="user";
    metaInfo.auditType="FHIRedSHIP";
    metaInfo.actionData = {"name":"email",value:refEmail}
   
    if(settingData._id){
      contextObject.prevRefAccount = (settingData.meta)?settingData.meta.linkWith:"";
       metaInfo.module="account_link_changed_with_referral";
       metaInfo.action="account_link_changed_with_referral";
    }


    let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);
    }
  let settingResp;
  if(settingData._id){
  let reqData = {
    id:settingData._id,
    body:{
    isEnable:true,
    meta:{linkWith:refEmail}  
    }
  }
  settingResp = await settingDao.update(req,res,reqData);

  }
  else{
   settingResp = await settingDao.save(reqData,res);
  }

  if(settingResp.status == true){
      return { status:true,msg:"",data:settingResp,linkId: linkId };
      }
      else{
       return { status:true,msg:"Setting not saved due to some error"};
      }

  } else {
    return { status: false,"msg":"Account doesn't exist into referral system" };
  }
 
}


var enableReferral = async function (req, res) {
  const authHeader = { Authorization: referralAuth };
  let linkData = (req.body.linkData)?req.body.linkData:{};
  let curEmail = req.decoded.email;
  let refEmail = (linkData.refEmail)?linkData.refEmail:"";
  let facility = (linkData.facility)?linkData.facility:"";
  let settingData = (req.body.setting)?req.body.setting:{};
  let newAccountLink = (linkData.newAccountLink)?linkData.newAccountLink:false;
  let resp;

  if(facility == ""){
  return { status:false,msg:"Setting not saved due to facility is missing"};
  }
  else{
   
  if(req.decoded.organization !== facility){
    return { status:false,msg:"Setting not saved due to facility mismatched"};
  }
  }
  
  let orgData = await orgModal.findOne({_id:mongoose.Types.ObjectId(facility)});

   if(orgData){

  if(settingData._id && newAccountLink == false){
  resp = await enableRefLink(req,res,settingData,authHeader);

  }
  else{
  let facilityId = (orgData.uuid)?orgData.uuid:orgData._doc.uuid;

  resp = await createReferralLink(req,res,curEmail,refEmail,facilityId,settingData,authHeader);
  }

   }
   else{
   return { status:false,msg:"Setting not saved due to facility not found"};
   }
 

  return resp;

};


var disableReferral = async function(req,res){
  logger.info(`settings : service : Disable Referral: received request`);
  let resp;
   try {
  let setting = req.body.setting;
  if(setting && setting._id != undefined &&  setting._id != null){
  let reqData = {
    id:setting._id,
    body:{
    isEnable:false  
    }
  }
    let data={};
    let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
    let userResp = await userModel.findByIdAndUpdate(userDataSet._id,{"uuidEnable":false});
    if(userResp){
    let settingResp = await settingDao.update(req,res,reqData);
    if(settingResp.status == true){

    
    let performerUser = await helperService.returnName(userDataSet);
    
    var contextObject = {
      performer: performerUser,
      documentName: (setting.meta)?setting.meta.linkWith:""
    };
   let userRole = (userDataSet.role._doc)?userDataSet.role._doc.role.toLowerCase():userDataSet.role.role.toLowerCase();

    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.module="disable_account_link_with_referral";
    metaInfo.documentName=(setting.meta)?setting.meta.linkWith:"";
    metaInfo.documentId=userDataSet._id;
    metaInfo.action="disable_account_link_with_referral";
    metaInfo.entity="user";
    metaInfo.auditType="FHIRedSHIP";
   let auditResp =  await helperService.saveAuditData(req,metaInfo,userDataSet._id.toString(),userRole,contextObject);



    return { status:true,msg:"",data:settingResp,uuidEnable:false,linkId:userResp.uuid};
    }
    else{
    return { status:false,msg:"Setting not updated"};
    }

    }
    else{
    return { status:false,msg:"Setting not updated"};
    }


    }

 }catch(err){
  return { status:false,msg:err};
  logger.error(`message : service : disable referral account : Error : ${err}`);
  throw e;

 }



}





module.exports.disableReferral = disableReferral;
module.exports.enableReferral = enableReferral;
module.exports.accountChange = accountChange;
module.exports.get = get;
module.exports.enableCalendly = enableCalendly;
module.exports.disableCalendly = disableCalendly;