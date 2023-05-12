/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

const logger = require('../config/logger');
const taskTemplate = require('../models/task-template');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;


var findAll = async function (object) {
  logger.info(`task-template : service : findAll : received request`);
  try {
    const template = await taskTemplate.find(object);
    return template;
  } catch (e) {
   return [];
  }
};

module.exports.findAll = findAll;
