/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const taskDao = require('../dao/task.dao');
const logger = require('../config/logger');

const save = async (req, res) => {
  logger.info(`task : service : save : received request`);
  try {
    const response = await taskDao.create(req, res);
    return response;
  } catch (e) {
    logger.error(`task : service : save : Error : ${e}`);
    throw e;
  }
};

const getTasks = async (req, res) => {
  logger.info(`task : service : getTasks : received request`);
  try {
    const response = await taskDao.getTasks(req, res);
    return response;
  } catch (e) {
    logger.error(`task : service : getTasks : Error : ${e}`);
    throw e;
  }
};

const update = async (req, res) => {
  logger.info(`task : service : update : received request`);
  try {
    const response = await taskDao.update(req, res);
    return response;
  } catch (e) {
    logger.error(`task : service : update : Error : ${e}`);
    throw e;
  }
};
module.exports.update = update;
module.exports.save = save;
module.exports.getTasks = getTasks;
