var logger = require('../config/logger');
const mongoose = require('mongoose');
const notesModel = require('../models/notes');
var constants = require('../config/constants');
var helperService = require('../services/helper.service');

const save = async (req,res) => {
  logger.info(`Notes : dao : Save notes : received request`);
  try {
    const response = await notesModel.create({ ...req.body });
    if (response && response!=null) {
      return response;
    }
    throw new Error(`notes not saved`);
  } catch (e) {
    logger.error(`Notes : dao : Save : Error : ${e}`);
    throw e;
  } 
};

const update = async (req,res) => {
  logger.info(`Notes : dao : Update Notes  : received request`);
  try {
    let id = req.body._id;
    let notesData = req.body;
    delete notesData._id;
    const response = await notesModel.findByIdAndUpdate(id, notesData, { new: true });

    if (response && response!=null) {
      return response;
    }
    throw new Error(`notes not update`);
  } catch (e) {
    logger.error(`Notes : dao : Update : Error : ${e}`);
    throw e;
  } 
};


const remove = async (req,res) => {
  logger.info(`Notes : dao : remove Notes  : received request`);
  try {
    let id = req.params.id;
    const response = await notesModel.findByIdAndUpdate(id, {isDeleted:true}, { new: true });
    if (response && response!=null) {
      return response;
    }
    throw new Error(`not remove notes`);
  } catch (e) {
    logger.error(`Notes : dao : Remove : Error : ${e}`);
    throw e;
  } 
};
const get = async (req,res) => {
  logger.info(`Notes : dao : get Notes  : received request`);
  try {
    let query = {};
    if(req.params.id){
      query = {"_id":req.params.id,"isDeleted":{$ne:true}};
    }
    query = {
    "moduleId":req.query.module,
    "linkWith":req.query.type,
    "meta.status":req.query.status,
    "isDeleted":{$ne:true}
    };
    let notes = await notesModel.findOne(query);
    notes = (notes)?notes:{};

    if (notes && notes!=null) {
      return notes;
    }
    throw new Error(`not get notes`);
  } catch (e) {
    logger.error(`Notes : dao : get : Error : ${e}`);
    throw e;
  } 
};
module.exports.get = get;
module.exports.remove = remove;
module.exports.update = update;
module.exports.save = save;