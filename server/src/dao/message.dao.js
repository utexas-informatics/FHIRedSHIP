/* eslint-disable object-shorthand */
/* eslint-disable import/order */
/* eslint-disable prefer-template */
/* eslint-disable arrow-body-style */
/* eslint-disable dot-notation */
const messages = require('../models/message');
const logger = require('../config/logger');
const notificationService = require('../services/notification.service');
const { createAudit } = require('../services/audit.service');
var socket = require('../config/socket');
var CryptoJS = require("crypto-js");
var userModel = require("../models/users");

var save = async function (data) {
  logger.info(
    `message : dao  : save : received request` + JSON.stringify(data)
  );
  try {
    const message = await messages.create(data);
    if (message) {
      let onlineUser = socket.returnUserList(message.roomId);
      if (
        message.receiverId &&
        message.receiverId.length !== 0 &&
        message.meta &&
        message.meta.module
      ) {

      const receiverId = message.receiverId;

        for (let i = 0; i < receiverId.length; i++) {
          let id = receiverId[i];
          if(id){
            onlineUser = (onlineUser)?onlineUser:[];
            let index = onlineUser.indexOf(id.toString());
          if (index === -1) {
            let isUserFound = false;
            
          let usersIds = await userModel.find({adminId:id.toString()},{_id:1});
          if(usersIds && usersIds.length > 0){
           for(var a = 0; a <usersIds.length;a++){
            let newIndex = onlineUser.indexOf(usersIds[a]._id.toString());
            if(newIndex !== -1){
              isUserFound = true;
              break;
            }
           }

          }

            if(isUserFound == false){
            let nData = {};
            nData.body = {
              module: message.meta.module,
              moduleId: message.meta.moduleId,
              sender: message.senderId,
              receiver: id,
              roomId: message.roomId,
            };
            if(message.meta.chatFor){
              nData.body.chatFor = message.meta.chatFor;
            }
            notificationService.chatNotification(nData, '');

            }
        
          

          }
          }
          
        }
      }

      return message;
    }
    throw new Error(`Error while creating message`);
  } catch (e) {
    logger.error(`message : dao : save : Error : ${e}`);
    throw e;
  }
};

var getByRoomId = async function (req,res) {
  logger.info(
    `message : dao  : getByRoomId : received request` +
      JSON.stringify(req.params.roomId)
  );
  try {

  if(req.params.roomId == "" || req.params.roomId == undefined || req.params.roomId == null){
  res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
  }  
  // let usersList = await socket.returnUserList(req.params.roomId);

  // usersList = (usersList)?usersList:[];
   
  // if(usersList && usersList.indexOf(req.decoded._id) === -1){
  // res.status(403).json({status:false,data:[],msg:"You don’t have access to this page or your session has expired"});
  // }
   
    let pageNum = Number(req.query.page) - 1;
    let record = Number(req.query.record) + 1;
    let skip = pageNum * Number(req.query.record);
    const message = await messages
      .find({ roomId: req.params.roomId })
      .populate('senderId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(record);

    let respData = {
      moreRecord: false,
    };

    if (message.length > Number(req.query.record)) {
      respData['moreRecord'] = true;
      message.pop();
    }
   
    let newMessages = [];
    for(var a=0; a< message.length;a++){

    let newMsg = {};

    let fullName = "";
    let senderId = message[a].senderId._id.toString();

      if(message[a].senderId && message[a].senderId.firstName != "" && message[a].senderId.firstName != undefined && message[a].senderId.firstName != null){
        fullName = message[a].senderId.firstName;
        if(message[a].senderId.lastName != ""){
          fullName = fullName+" "+message[a].senderId.lastName;
        }
      }
      else{
        fullName = message[a].senderId.email;
      }
   
     // newMsg['senderId'] = CryptoJS.AES.encrypt(senderId, message[a].roomId.trim()).toString();
     // newMsg['senderInfo'] = CryptoJS.AES.encrypt(fullName, message[a].roomId.trim()).toString();
     newMsg['sd'] = Buffer.from(senderId.toString()).toString('base64');
     newMsg['sdi'] = Buffer.from(fullName.toString()).toString('base64');
     newMsg['message'] = message[a].message;
     newMsg['roomId'] = message[a].roomId;
     newMsg['createdAt'] = message[a].createdAt;
     newMsg['meta'] = message[a].meta;
     newMsg['ntToken'] = (message[a].ntToken)?message[a].ntToken:"";
     newMsg['_id'] = message[a]._id;
     newMsg['isDeleted'] = message[a].isDeleted;
     newMsg['moduleId'] = message[a].moduleId;
     newMsg['type'] = message[a].type;
     newMessages.push(newMsg);

    }
   
    respData['messages'] = newMessages;

    if (respData.messages) {
      return respData;
    }
    throw new Error(`Error while getting message`);
  } catch (e) {
    logger.error(`message : dao : getByRoomId : Error : ${e}`);
    throw e;
  }
};

module.exports.save = save;
module.exports.getByRoomId = getByRoomId;
