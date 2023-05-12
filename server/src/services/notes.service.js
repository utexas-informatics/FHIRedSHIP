const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const notesDao = require('../dao/notes.dao');

var save = async function(req,res){
  logger.info(`notes : service : saveNotes : received request`);
  try {
    var responseData = await notesDao.save(req,res);
    return responseData;
  } catch (e) {
    logger.error(`notes : service : save notes : Error : ${e}`);
    throw e;
  }


}

var update = async function(req,res){
  logger.info(`notes : service : updateNotes : received request`);
  try {
    var responseData = await notesDao.update(req,res);
    return responseData;
  } catch (e) {
    logger.error(`notes : service : update notes : Error : ${e}`);
    throw e;
  }
}

var remove = async function(req,res){
  logger.info(`notes : service : RemoveNotes : received request`);
  try {
    var responseData = await notesDao.remove(req,res);
    return responseData;
  } catch (e) {
    logger.error(`notes : service : remove notes : Error : ${e}`);
    throw e;
  }
}

var get = async function(req,res){
  logger.info(`notes : service : GetNotes : received request`);
  try {
    var responseData = await notesDao.get(req,res);
    return responseData;
  } catch (e) {
    logger.error(`notes : service : get notes : Error : ${e}`);
    throw e;
  }
}
module.exports.get =get;
module.exports.remove =remove;
module.exports.update =update;
module.exports.save = save;