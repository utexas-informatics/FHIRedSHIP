/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

const logger = require('../config/logger');
const notificationTemplate = require('../models/notification-template');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;


var findAll = async function (object) {
  logger.info(`notification-template : service : findAll : received request`);
  try {

    const template = await notificationTemplate.find(object).populate('deliveryChannel');
    return template;
 
  } catch (e) {
   return [];
  }
};

module.exports.findAll = findAll;
