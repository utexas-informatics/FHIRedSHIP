/* eslint-disable object-shorthand */
/* eslint-disable global-require */

/* eslint-disable func-names */

/* eslint-disable linebreak-style */
const fetchWrapper = require('./fetch-wrapper');
const userModal = require('../models/users');
var CryptoJS = require("crypto-js");
var socketIo = '';

var socketInstance = '';

var messageService = require('../services/message.service');

const connectedUsers = new Map();
const userJoinedRoomInformation = new Map();

var updateUsersList = function (room) {
  socketInstance.to(room).emit('usersList', {
    room: room,
    users: connectedUsers.get(room),
  });
};

var joinToRoom = function (room, user) {
  // create users array, if key not exists

  if (!connectedUsers.has(room)) {
    connectedUsers.set(room, []);
  }
  if(!userJoinedRoomInformation.has(user.toString())){
    userJoinedRoomInformation.set(user.toString(),[]);
  }
  // add user to room array
  
  let checkConnectedUserList = connectedUsers.get(room);
  
  if(checkConnectedUserList) {
  let checkUserId = checkConnectedUserList.indexOf(user.toString());
  if(checkUserId === -1){
      connectedUsers.get(room).push(user.toString());
  } 
  }
  
  let checkRoomList =   userJoinedRoomInformation.get(user.toString());

  if(checkRoomList) {
  let checkRoomId = checkRoomList.indexOf(room);
  if(checkRoomId === -1){
   userJoinedRoomInformation.get(user.toString()).push(room);
  } 
  }
  updateUsersList(room);

};



var removeUserFromRoom = function(room,user){
let userList = connectedUsers.get(room);
  if(userList){
  userList = userList.filter((u) => u !== user);
 


 // update user list
  if (!userList.length) {
    // delete key if no more users in room
    connectedUsers.delete(room);
  } else {
    connectedUsers.set(room, userList);
    // call update function
    updateUsersList(room);
  }
}

}


var leaveRoom = function (room, user) { 
   
   removeUserFromRoom(room,user);

  let roomList =  userJoinedRoomInformation.get(user.toString());
  
  if(roomList){
  roomList = roomList.filter((r) => r !== room);
    if(!roomList.length){
    userJoinedRoomInformation.delete(user.toString);
  }
  else{
     userJoinedRoomInformation.set(user.toString, roomList);
  }
  }
};

var returnUserList = function (room) {
  let userList = connectedUsers.get(room);
  return userList;
};


var returnRoomList = function (userId) {
  let roomList = userJoinedRoomInformation.get(userId);
  return roomList;
};


var removeUserFromAllRooms = function(userId){
  console.log("comes under remove users from all rooms");
  console.log("userId",userId);
  let newUserId = (userId)?userId:"";
let roomList = returnRoomList(newUserId.toString());
console.log("roomList",roomList);
if(roomList){

for(var a = 0; a < roomList.length; a++){
let userList = connectedUsers.get(roomList[a]);
if(userList){
userList = userList.filter((u) => u !== newUserId.toString());

  if (!userList.length) {
    connectedUsers.delete(roomList[a]);
  } else {
    connectedUsers.set(roomList[a], userList);
    console.log("user list",userList);
  }
}
}
}
}

var ioEvents = function (io) {
  io.on('connection', async (socket) => {
    socketIo = io;
    
    socketInstance = socket;

    socket.emit('socketConnected');

    socket.on('connectionInit', (data) => {

      socket.emit('createRoom');

    });

    socket.on('loggedInUser', async (token,data,authToken) => {
     let userData = await userModal.findOne({"token":authToken});
     if(userData){
      let fullName = "";
      if(userData.firstName != "" && userData.firstName != undefined && userData.firstName != null){
        fullName = userData.firstName;
        if(userData.lastName != ""){
          fullName = fullName+" "+userData.lastName;
        }
      }
      else{
        fullName = userData.email;
      }
      socket.senderInfo = {sender:userData._id.toString(),fullName:fullName};
     }
   });

    

    socket.on('join', async (id, user,token) => {
      if (user) {
        joinToRoom(id, user);
        if(socket.senderInfo && socket.senderInfo.sender){
          socket.userId = socket.senderInfo.sender.toString();
        }
        else{
           socket.userId = user.toString();
        }
       
        socket.token = token;
    }
      

      socket.join(id);
    });

    socket.on('leave', (id, user) => {
      if (user) {
        leaveRoom(id, user);
      }

      socket.leave(id);

    });

    socket.on('closeConnection', () => {
      socket.disconnect();
    });

    socket.on('disconnect', async () => {
      removeUserFromAllRooms(socket.userId);


    });

    socket.on('newMessage', async (data,user,token) => {
      if(data.moduleId == '' || data.moduleId == null || data.moduleId == undefined || data.ntToken == "" || data.ntToken == undefined || data.ntToken == null){
        io.to(socket.id).emit('unAuthorised',{"statusCode":403,msg:"module_id_missmatched"});
      }
    
      if(token == "" || token  == null || token ==undefined){
        io.to(socket.id).emit('unAuthorised',{"statusCode":403,msg:"token_missing"});
      }
      else{
      let userData = await userModal.findOne({"token":token});
      if(userData){
      let fullName = "";
      if(userData.firstName != "" && userData.firstName != undefined && userData.firstName != null){
        fullName = userData.firstName;
        if(userData.lastName != ""){
          fullName = fullName+" "+userData.lastName;
        }
      }
      else{
        fullName = userData.email;
      }

      data.senderId = userData._id.toString();
      data.senderInfo = fullName;
      
      const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      let check = base64RegExp.test(data.ntToken);
      if(check == true){
      let receiverId = Buffer.from(data.ntToken,'base64').toString('binary');
      data.receiverId = JSON.parse(receiverId);
      }
      else{
        data.receiverId = [];
      }

    
      const message = await messageService.save(data);
      let newMessagedata = {};
      newMessagedata['roomId'] = data.roomId.trim();
      newMessagedata['ntToken'] = data.ntToken;
      newMessagedata['_id'] = message._id;
      newMessagedata['meta'] = data.meta;
      newMessagedata['createdAt'] = message.createdAt;
      newMessagedata['type'] = data.type;
      newMessagedata['message'] = data.message;

      newMessagedata['sd'] = Buffer.from(data.senderId.toString()).toString('base64');
      newMessagedata['sdi'] = Buffer.from(data.senderInfo.toString()).toString('base64');
      data._id = message._id;
      data.createdAt = message.createdAt; 
    
      io.to(data.roomId).emit('addMessage', newMessagedata);


     }
     else{
     
       io.to(socket.id).emit('unAuthorised',{"statusCode":403,msg:"token_missing"});

     }




      }
   

     
    });
  });
};

var init = function (app) {
  var server = require('http').createServer(app);

  var io = require('socket.io')(server, {
    transports: ['websocket'],
  });

  // io.set('transports', ['websocket']);

  // io.use((socket, next) => {

  //   console.log('socket use');

  //   next();

  // });

  // Define all Events

  ioEvents(io);

  return server;
};

var returnSocket = function () {
  return socketIo;
};

var returnSocketInstance = function () {
  return socketInstance;
};
 
var returnRoomMapData = function () {
  return connectedUsers;
};

module.exports.returnUserList = returnUserList;
module.exports.returnRoomMapData = returnRoomMapData;
module.exports.updateUsersList = updateUsersList;
module.exports.leaveRoom = leaveRoom;
module.exports.joinToRoom = joinToRoom;
module.exports.init = init;

module.exports.returnSocket = returnSocket;

module.exports.returnSocketInstance = returnSocketInstance;
