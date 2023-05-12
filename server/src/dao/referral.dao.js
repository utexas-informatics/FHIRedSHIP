const logger = require('../config/logger');
var refModel = require('../models/referral');

var save = async function (data) {
    try{
      const resp = await refModel.create(data);
     return resp;
    
    }catch(e){
      throw e;
    }
    };


var update = async function (data) {
      try{
        const resp = await refModel.findOneAndUpdate({refId:data.id}, data.data);
       return resp;
      
      }catch(e){
    throw e;
  }
 };

var findOne = async function (query) {
      try{
        if(Object.keys(query).length == 0){
        return {};
        }
        else{
       const resp = await refModel.findOne(query);
       return resp;
        }
        const resp = await refModel.findOne(query);
       return resp;
      
      }catch(e){
    throw e;
  }
 };

 var findAll = async function (query) {
  try{
     if(Object.keys(query).length == 0){
        return [];
      }
      else{
  const resp = await refModel.find(query);
   return resp;
      }


  
  }catch(e){
throw e;
}
};

module.exports.findAll = findAll;
module.exports.findOne = findOne;
module.exports.update = update;
module.exports.save = save;