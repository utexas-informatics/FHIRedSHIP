const FCM = require('fcm-node');
const serverKey = require('./notifications-4b6c3-firebase-adminsdk-r37sa-c60587a16a.json');
var fcm = new FCM(serverKey);

module.exports = fcm;
