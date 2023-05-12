var referralService = require('./referral.service');
var constants = require('../config/constants');



var processAndUpdateRefStatus = async function(req, res){
let refData = await referralService.findOne({_id:req.body.id});

console.log("refData",refData);
if(refData._doc.rawData.status.toLowerCase() == req.body.meta.status.toLowerCase()){
res.send({"status":true});
}
else{
delete refData._doc._id;
refData._doc.rawData.status = req.body.meta.status.toLowerCase();
refData._doc.data.status = req.body.meta.status.toLowerCase();

let resp = await referralService.update({_id:req.body.id},refData);
res.send({"status":true});
}

}


var callback = async function (req, res, next) {
let data = req.body;
if(data && data.meta && data.meta.type == 'referral_status_updated'){
processAndUpdateRefStatus(req, res);

}



};







module.exports.callback = callback;