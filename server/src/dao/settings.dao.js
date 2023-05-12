var logger = require('../config/logger');
const mongoose = require('mongoose');
const settingModel = require('../models/settings');
var constants = require('../config/constants');

const save = async (req,res) => {
  logger.info(`Settings : dao : Save : received request`);
  try {
   const response = await settingModel.create({ ...req.body});   
   if (response && response!=null) {
      return {status:true,data:response};
    }
    return {status:false,data:{}};
    throw new Error(`Setting Not Save`);
  } catch (e) {
    logger.error(`Settings : dao : Save : Error : ${e}`);
    throw e;
  } 
};

const update = async (req,res,reqData) => {
  logger.info(`Settings : dao : Update : received request`);
  try {
   let data = reqData.body;
   let id = reqData.id;
   const response = await settingModel.findByIdAndUpdate(id,data,{new: true});   
   if (response && response!=null) {
      return {status:true,data:response};
    }
    else{
      return {status:false,data:{}};
    }
    throw new Error(`Setting not updated`);
  } catch (e) {
    logger.error(`Settings : dao : Update : Error : ${e}`);
    throw e;
  } 
};


const get = async (req,res) => {
  logger.info(`Settings : dao : Get Settings : received request`);
  try {
   let data = req.body;
   let userId = (req.decoded._doc)?req.decoded._doc._id:req.decoded._id;
   const response = await settingModel.find({"userId":userId.toString(),isDeleted:{$ne:true}});   
   if (response && response!=null) {
      return {status:true,data:response};
    }
    throw new Error(`Setting not get`);
  } catch (e) {
    logger.error(`Settings : dao : Get Setting : Error : ${e}`);
    throw e;
  } 
};

module.exports.get = get;
module.exports.save = save;
module.exports.update = update;