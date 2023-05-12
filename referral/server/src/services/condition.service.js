const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const condition = require('../models/condition');
const fhirUrl = process.env.FHIR_API_BASE_URL;
const fhirAuth = process.env.fhirauth;
const constant = require('../config/constants');
var userService = require('./user.service');

var getConditionsByResp = async function (req, res, next) {
  try {
  	let object={'questionnaireResponse':req.params.id};
   var conditionResponse = await condition.find(object);
/* let conditionResponse=[
{questionnaireresponsId:'62fba4e90bcb2f70f587f17a','sid':'1',code:'z233',desc:'Desc 1',need:'Food',condId:''},
{questionnaireresponsId:'62fba4e90bcb2f70f587f17a','sid':'1',code:'z122',desc:'Desc 2',need:'Finance',condId:'630484fb5f0e8842cae8849c'},
{questionnaireresponsId:'62fba4e90bcb2f70f587f17a','sid':'1',code:'z122',desc:'Desc 3',need:'House',condId:'`'},
]*/
    return conditionResponse;
  } catch (e) {
return [];
  /*
    var error = 'Failed to get condition';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );*/
  }
};

var remove = async function (req) {
  logger.info(`remove : service : remove condition : received request`);
  try {
    let id=req.params.id
    let object = {'_id':id};
    const conditionResponse = await condition.remove(object);
    return conditionResponse;
  } catch (e) {
    logger.error(
      `condition : service : remove condition : Error : ${e}`
    );
    throw e;
  }
};

var save = async function (object) {
  try {
    const conditionResponse = await condition.create(object);
      return conditionResponse;
  } catch (e) {
    var error = 'Failed to save condition';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};


 
var update = async function (fromObject,updateObject) {
  logger.info(`condition : service : update : received request`);
  try {
    const response = await condition.findOneAndUpdate(fromObject,updateObject);
    return response;
  } catch (e) {
    logger.error(`condition : service : update : Error : ${e}`);

    throw e;
  }
};



var getConditions = async function (req, res, next) {
  try {
    let query={};
    if(req.params && req.params.id){
      query['_id']=req.params.id;
    }
    if(req.query){
      let qPm=req.query;
      for (const [key, value] of Object.entries(qPm)) {
       console.log(`${key}: ${value}`);
       if(qPm[key] && qPm[key]!=null && qPm[key]!=''){
         query[key]=qPm[key];
       }
    }
  }
 
    if(Object.keys(query).length == 0){
      return [];
    }
    var conditionResponse = await condition.find(query);
    return conditionResponse;
  } catch (e) {
return [];
  }
};

var getConditionByPatient = async function (req, res, next) {
  try {
    let query={};
    const patQuery={'sid':req.params.id};
    var pat = await userService.getUser(patQuery);
    query["patId"] =  pat ?pat._id.toString():'';
    if(req.query.s && req.query.s != ""){
    
    var searchParam = req.query.s;
    query['$or'] = [{"code":{ $regex:searchParam, $options: 'i' }},{"desc":{ $regex:searchParam, $options: 'i' }}];
    //query['$or'] = [{'code.coding':{$elemMatch:{"code":{ $regex:searchParam, $options: 'i' }}}},{'code.coding':{$elemMatch:{"display":{ $regex:searchParam, $options: 'i' }}}},{'category.$.conding':{$elemMatch:{"display":{ $regex:searchParam, $options: 'i' }}}}]
    
    }
    var conditionResponse = await condition.find(query);
    return conditionResponse;
  } catch (e) {
   return [];
  }
}; 

module.exports.getConditionByPatient = getConditionByPatient;
module.exports.getConditions = getConditions;
module.exports.update = update;
module.exports.save = save;
module.exports.getConditionsByResp = getConditionsByResp;
module.exports.remove = remove;