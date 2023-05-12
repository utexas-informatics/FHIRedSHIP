var logger = require('../config/logger');
const mongoose = require('mongoose');
const template = require('../models/template');
var constants = require('../config/constants');
 
const getFormById = async (req,res) => {
  logger.info(`Form : dao : getFormById : received request`);
  try {
    const formId = req.params.id;
    console.log("form id",formId);
    const response = await template.findOne({_id:mongoose.Types.ObjectId(formId)});
    if (response && response!=null) {
      return response;
    }
    throw new Error(`template not found`);
  } catch (e) {
    logger.error(`template : dao : getFormById : Error : ${e}`);
    throw e;
  } 
};


const getAll = async (req,res) => {
  logger.info(`Form : dao : getAll forms : received request`);
  try {
    const searchText = (req.query.s)?req.query.s:"";

    let query = { name: { $regex: searchText, $options: '$i' }};

    const response = await template.find(query,{"name":1,"_id":1}).limit(10);
    if (response && response!=null) {
      return response;
    }
    throw new Error(`template not found`);
  } catch (e) {
    logger.error(`template : dao : getFormById : Error : ${e}`);
    throw e;
  } 
};

const getOne = async (data) => {
  logger.info(`Form : dao : getOne : received request`);
  try {
 
    const response = await template.findOne(data);
    return response;
  
  } catch (e) {
    logger.error(`Form : dao : getOne : Error : ${e}`);
    throw e;
  } 
};

module.exports.getOne = getOne;
module.exports.getAll = getAll;
module.exports.getFormById = getFormById;