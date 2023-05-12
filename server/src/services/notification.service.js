/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
var notificationDao = require('../dao/notification.dao');
const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');

var referralAuth = process.env.RERERRAL_TOKEN;
var fhirAppUrl = process.env.FHIREDAPP_URL;
var socket = require('../config/socket');
const { domain } = require('../config/constants');
const helperService = require('./helper.service');
const notificationModel = require('../models/notification');
const notificationType = require('../models/notification-type');
const notificationTemp = require('../models/notification-template');
const notificationDel = require('../models/notification-delivery-channel');
const taskTemplateService = require('./task-template.service');
const notificationTemplateService = require('./notification-template.service');
var constants = require('../config/constants');

const update = async (req, res) => {
  logger.info(`notification : service : update : received request`);
  try {
    const response = await notificationDao.update(req, res);
    return response;
  } catch (e) {
    logger.error(`notification : service : update : Error : ${e}`);
    throw e;
  }
};

var callback = async function (req, res) {
  if (req.headers.authorization && req.headers.authorization === referralAuth) {
    if (req.query.callbackType && req.query.callbackType === 'message_update') {
      const nReq = {};
      nReq.params = {}
      nReq.params.id = req.body.id;
      nReq.body = req.body.data;
      const response = await update(nReq, res);
      return response;
    }else{
      const response = await notificationDao.callback(req, res);
      return response;
    }
   
  }
  return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
};

var sendMobileNotification = async function (data) {
  try {
    const header = {};
    const response = await fetchWrapper.post(
      `${fhirAppUrl}/api/notifications/callback`,
      data,
      header
    );
    return response;
  } catch (e) {
    logger.error(
      `notification : service : sendMobileNotification : Error : ${e}`
    );
    throw e;
  }
};

var sendNotification = async function (data) {
  console.log('in sent not-->', data);
  const io = socket.returnSocket();
  io.to(data.receiverId.toString()).emit('notification', data);
  return true;
};
 
var chatNotification = async function (req, res) {
  try {
    let data = req.body;
    var receiver = await helperService.getUserDetails({ _id: data.receiver });
    var sender = await helperService.getUserDetails({ _id: data.sender });
    if (receiver && sender) {
      const notification = {};
      notification.type = `${data.module.toLowerCase()}_chat`;
      if (receiver.role.role.toLowerCase() === 'patient') {
        notification.type = `${notification.type}_patient`;
        notification.receiver = [
          {
            id: receiver.sid ? receiver.sid : '',
            type: receiver.role.role,
          },
        ];
      } else {
        notification.receiver = [
          {
            id: receiver.uuid ? receiver.uuid : '',
            type: receiver.role.role,
          },
        ];
      }

      if (sender.role.role.toLowerCase() === 'patient') {
        notification.sender = {
          id: sender.sid ? sender.sid : '',
          type: sender.role.role,
        };
      } else {
        notification.sender = {
          id: sender.uuid ? sender.uuid : '',
          type: sender.role.role,
        };
      }
      notification.meta = {
        module: data.module,
        moduleId: data.moduleId,
        roomId: data.roomId,
        count: 1,
        assignedTo: notification.receiver[0].id,
        onBehalfOf: '',
        performer: notification.sender.id,
        documentName: '',
        subModule: '',
        subModuleId: '',
        chatFor: data.chatFor ? data.chatFor : '',
      };

      var lang = constants.language;
      const nType = await notificationType.findOne({ name: notification.type });
      if (nType) {
        var sentFor = nType.sentFor;
        for (var j = 0; j < sentFor.length; j++) {
          const currentObject = sentFor[j];
          const userType = currentObject.type;
          const taskTemps = currentObject.taskTemplate;
          const notificationTemps = currentObject.notificationTemplate;
          var notificationTemplateQuery = { _id: { $in: notificationTemps } };
          var notificationTemplates = await notificationTemplateService.findAll(
            notificationTemplateQuery
          );
          let pageUrl = '';
          for (let m = 0; m < notificationTemplates.length; m++) {
            console.log(
              ' notificationTemplates >>>> ',
              notificationTemplates[m]
            );
            const curNotificationTemplate = notificationTemplates[m];
            const { title } = curNotificationTemplate;

            const messageTemp = curNotificationTemplate.message;
            const notificationDetail = await notificationModel.findOne({
              read: false,
              senderId: sender._id,
              receiverId: receiver._id,
              'meta.roomId': notification.meta.roomId,
            });
            let updateId = '';
            if (notificationDetail) {
              updateId = notificationDetail._id;
              notification.meta.count = notificationDetail.meta.count
                ? notificationDetail.meta.count + 1
                : 1;
            }

            var msgContextObject = { ...notification.meta };
            let performerName = await helperService.returnName(sender);
             let receiverName = await helperService.returnName(receiver);

            msgContextObject.performer = performerName;
            msgContextObject.assignedTo = receiverName;
            const notifyMessage = await helperService.compileTemplate(
              messageTemp,
              msgContextObject
            );
            const messageTemp_sp = curNotificationTemplate.message_sp;
            const notifyMessage_sp = await helperService.compileTemplate(
              messageTemp_sp,
              msgContextObject
            );

            let notificationMsg = notifyMessage;

            if (lang === 'sp') {
              notificationMsg = notifyMessage_sp;
            }

            const notificationData = {};
            notificationData.body = {
              type: nType._id,
              senderId: sender && sender._id ? sender._id : '',
              senderType: sender.role.role.toLowerCase(),
              receiverId: receiver && receiver._id ? receiver._id : '',
              receiverType: receiver.role.role.toLowerCase(),
              meta: notification.meta,
              notificationType: data.type,
              title,
              message: notifyMessage,
              message_sp: notifyMessage_sp,
            };

            const notifyPageUrlTemp = curNotificationTemplate.pageLink;
            let notifyPageUrl = await helperService.compileTemplate(
              notifyPageUrlTemp,
              msgContextObject
            );
            if (
              currentObject.isTask === true &&
              curNotificationTemplate.taskLink
            ) {
              notifyPageUrl = await helperService.compileTemplate(
                curNotificationTemplate.taskLink,
                msgContextObject
              );
            }
            pageUrl = `${
              domain[curNotificationTemplate.redirectTo]
            }${notifyPageUrl}`;

            notificationData.body.url = pageUrl;

            let notificationRes = '';
            if (updateId) {
              notificationRes = await notificationModel.findByIdAndUpdate(
                updateId,
                notificationData.body,
                { new: true }
              );
            } else {
              notificationRes = await notificationDao.createNotification(
                notificationData,
                ''
              );
            }

            if (curNotificationTemplate.deliveryChannel.name === 'MobilePush') {
              const nReq = {};
              nReq.body = {
                type: nType._id,
                sender: notification.sender,
                receiver: notification.receiver,
                meta: notification.meta,
                notificationType: notification.type,
                title,
                message: notificationMsg,
              };
              notificationData.body.meta.id = notificationRes._id;
              nReq.body.appName = 'FS';
              nReq.body.meta.url = pageUrl;
              nReq.body.meta.count = nReq.body.meta.count.toString();
              console.log('nReq--->', nReq.body);
              try {
                await sendMobileNotification(nReq.body);
                await sendNotification(notificationData.body);
              } catch (err) {
                console.log('data check ->> ', JSON.stringify(err));
              }
            } else {
              notificationData.body._id = notificationRes._id;
              await sendNotification(notificationData.body);
            }
          }
        }
      }
    }
  } catch (e) {
    logger.error(`notification : service : chatNotification : Error : ${e}`);
    throw e;
  }
};

var get = async function (req,res) {
  logger.info(`notification : service : get : received request`);
  try {
    var notification = await notificationDao.get(req,res);
    return notification;
  } catch (e) {
    logger.error(`notification : service : get : Error : ${e}`);
    throw e;
  }
};

const getById = async (req, res) => {
  logger.info(`notification : service : getById : received request`);
  try {
    const response = await notificationDao.getById(req, res);
    return response;
  } catch (e) {
    logger.error(`notification : service : getById : Error : ${e}`);
    throw e;
  }
};

const getByRoomId = async (req, res) => {
  logger.info(`notification : service : getByRoomId : received request`);
  try {
    const response = await notificationDao.getByRoomId(req, res);
    return response;
  } catch (e) {
    logger.error(`notification : service : getByRoomId : Error : ${e}`);
    throw e;
  }
};

const updateAll = async (req, res) => {
  logger.info(`notification : service : updateAll : received request`);
  try {
    const response = await notificationDao.updateAll(req, res);
    return response;
  } catch (e) {
    logger.error(`notification : service : updateAll : Error : ${e}`);
    throw e;
  }
};

module.exports.getByRoomId = getByRoomId;
module.exports.updateAll = updateAll;
module.exports.getById = getById;
module.exports.update = update;
module.exports.get = get;
module.exports.chatNotification = chatNotification;
module.exports.callback = callback;
module.exports.sendMobileNotification = sendMobileNotification;
module.exports.sendNotification = sendNotification;
