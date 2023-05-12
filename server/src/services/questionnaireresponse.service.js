const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
var helperService = require('./helper.service');
const constant = require('../config/constants');

var getQuestionnaireresponses = async function (req, res) {
const authHeader = { Authorization: referralAuth };
let queryParameterString='';
 let isAccountLinked = false;
 let page  = (req.query.page)?Number(req.query.page):1;
 let limit  = (req.query.limit)?Number(req.query.limit):10;
// let mappingWithpatientRole=constant.parameterMappingWithPatientRole;
 let mappingWithUserRole=constant.parameterMappingWithUserRole;
  let role=req.query.requester_type;

/*let mappingWithpatientRole={
  patient:'sid',
  sid:'id',
  requester_type:'requester_type'
 }
 let mappingWithUserRole={
  uuid:'id',
  patient:'sid',
  requester_type:'requester_type'
 }*/


if(req.decoded && req.decoded.role && req.decoded.role.role == 'Patient' &&  req.decoded._id !== req.query.patient){
 res.send({status:false,data:[],error:"access_denied"});
}

else{

let query={};

    if(req.query){
      // if(req.query.patient){
      const patData = await helperService.getUserDetails({
          _id: req.query.patient,
        });
        if(patData){
          req.query.patient = (patData.sid)?patData.sid:"";
        }
        if(role == "Patient"){
            if(req.query.patient && req.query.patient != ""){
             isAccountLinked = true;
           }

        }

        if(role !="Patient"){
        const userData = await helperService.getUserDetails({
          _id: req.query.id,
        });
        if (userData) {
         req.query.id = (userData.uuid)?userData.uuid:"";
          if(req.query.id && req.query.id != ""){
             isAccountLinked = true;
           }
        }

        }

     
 
        let qParam=req.query;
       for (const [key, value] of Object.entries(qParam)) {
       console.log(`${key}: ${value}`);
       if(qParam[key] && qParam[key]!=null && qParam[key]!=''){
       	let prefix='&';
       	if(queryParameterString==''){
       	 prefix='?';
       	}

          queryParameterString=queryParameterString+prefix+mappingWithUserRole[key]+`=`+value 
         // if(role=='Patient'){
         // 	if(key!='uuid'){
         // 	queryParameterString=queryParameterString+prefix+mappingWithUserRole[key]+'='+value	
         // 	}
         // }else{
         // 	queryParameterString=queryParameterString+prefix+mappingWithUserRole[key]+`=`+value	
         // }

       }
    }

  }

if(referralUrl && isAccountLinked == true){
  try{
  const resp = await fetchWrapper.get(
        `${referralUrl}/api/questionnaireresponse${queryParameterString}`,
        authHeader
      );
if(resp){
 return resp;
}else{
   return {status:false,data:[]};
}
}catch(err){
  return {status:false,data:[]};
}
}
else{
 return {status:false,data:[]};
}

}


};


module.exports.getQuestionnaireresponses = getQuestionnaireresponses;