/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
var messageDao = require('../dao/message.dao');
const logger = require('../config/logger');

var save = async function (data) {
  logger.info(`message : service : save : received request`);
  try {
    var message = await messageDao.save(data);
    return message;
  } catch (e) {
    logger.error(`message : service : save : Error : ${e}`);
    throw e;
  }
};

var getByRoomId = async function (data,res) {
  logger.info(`message : service : getByRoomId : received request`);
  try {
    var message = await messageDao.getByRoomId(data,res);
    return message;
  } catch (e) {
    logger.error(`message : service : getByRoomId : Error : ${e}`);
    throw e;
  }
};

module.exports.save = save;
module.exports.getByRoomId = getByRoomId;
