const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
var helperService = require('./helper.service');
const constant = require('../config/constants');

var getById = async function (req, res) {
const authHeader = { Authorization: referralAuth };

if(referralUrl){
try{
let id = req.params.id;
const resp = await fetchWrapper.get(
        `${referralUrl}/api/Questionnaire/${id}`,
        authHeader
      );
if(resp){
 return {data:resp,status:true};
}else{
   return {status:false,data:{},"msg":"No Assessment Form found"};
}
}catch(err){
  return {status:false,"msg":err,data:{}};
}
}
else{
  return {status:false,"msg":"Handshake with Referral system not enable",data:{}};
}



};


module.exports.getById = getById;