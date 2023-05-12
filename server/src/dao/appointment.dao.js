const mongoose = require('mongoose');
var logger = require('../config/logger');
const appointment = require('../models/appointment');
var constants = require('../config/constants');
const fetch = require('../config/fetch-wrapper');

const save = async (req, res) => {
  logger.info(`appointment : dao : save appointment : received request`);
  try {
    const response = await appointment.create({ ...req.body });
    if (response && response != null) {
      return response;
    }
    throw new Error(`appointment not saved`);
  } catch (e) {
    logger.error(`appointment : dao : save : Error : ${e}`);
    throw e;
  }
};

const getOne = async (req, res) => {
  logger.info(`appointment : dao : getOne appointment : received request`);
  try {
    const response = await appointment
      .findOne({ ...req.body })
      .populate('cbo')
      .populate('chw')
      .populate('invitee');
    return response;
  } catch (e) {
    logger.error(`appointment : dao : getOne : Error : ${e}`);
    throw e;
  }
};

const update = async (req, res) => {
  logger.info(`appointment : dao : update appointment : received request`);
  try {
    let id = req.body.id;
    let data = req.body.data;
    const response = await appointment.findByIdAndUpdate(id, data, {
      new: true,
    });
    return response;
  } catch (e) {
    logger.error(`appointment : dao : update : Error : ${e}`);
    throw e;
  }
};

const getAll = async (req, res) => {
  logger.info(`appointment : dao : getAll : received request`);
  try {
    //const data = req.body;
    // const query = {
    // "status": { $ne: "canceled" }
    // };
    const query = {};

    if(req.query.moduleId){
      query['referral'] = req.query.moduleId;
    }
    let page = (req.query.page)?parseInt(req.query.page):1;
    let limit = (req.query.limit)?parseInt(req.query.limit):10;
    let skip = (page-1) * limit; 

    // const query = { referral: req.params.id,"status": { $ne: "canceled" }};
    if(Object.keys(query).length == 0){
    return { status:true,data: [],totalCount:0 };
    }
    const count = await appointment.count(query);

    

    const response = await appointment.find(query).populate('cbo').populate('chw').populate('invitee').skip(skip).limit(limit).sort({ updatedAt: -1 });
    return { status:true,data: response,totalCount:count };
  } catch (e) {
    logger.error(`appointment : dao : getAll : Error : ${e}`);
    throw e;
  }
};

const cancel = async (req, res) => {
  logger.info(`appointment : dao : cancel : received request`);
  const data = req.body;
  try {
     const data = req.body;
    let uuid = data.eventUrl.split('scheduled_events/')[1];
    const authHeader = { Authorization: `Bearer ${data.token}`};
    let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
    const response = await appointment.findByIdAndUpdate(data._id,{updatedBy:userDataSet._id.toString()});
    if(response){
    const calendllyResponse = await fetch.post(
      `${constants.calendllyBaseUrl}/scheduled_events/${uuid}/cancellation`,
      {},
      authHeader
    );
    return calendllyResponse;
   }

  } catch (e) {
     let userDataSet = (req.decoded._doc)?req.decoded._doc:req.decoded;
    const response = await appointment.findByIdAndUpdate(data._id,{status:"canceled",updatedBy:userDataSet._id.toString()});
    return {"status":false,error:e};
    logger.error(`appointment : dao : cancel : Error : ${e}`);
    throw e;
  }
};


module.exports.cancel = cancel;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.save = save;
module.exports.getOne = getOne;
