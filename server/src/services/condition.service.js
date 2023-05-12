const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
const { createAudit } = require('./audit.service');

var getConditions = async function (req, res) {
const authHeader = { Authorization: referralAuth };
let queryParameterString='';
if(req.params.id){
queryParameterString=queryParameterString+`/`+req.params.id;
}
if(req.query.questionnaireResponse){
queryParameterString=queryParameterString+`?questionnaireResponse=`+req.query.questionnaireResponse
}
try{
  const resp = await fetchWrapper.get(
        `${referralUrl}/api/condition${queryParameterString}`,
        authHeader
      );
if(resp){
 return {data:resp};
}else{
	 return {data:[]};
}
}catch(err){
  return {data:[]};
}
};

 
module.exports.getConditions = getConditions;