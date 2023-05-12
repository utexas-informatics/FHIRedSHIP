var errorResponse = require('../config/error-response');
var callbackService = require('../services/callback.service');

var fsAuth = process.env.FS_AUTH;

var callback = async function (req, res, next) {

if (req.headers.authorization && req.headers.authorization === fsAuth) {
    var response = await callbackService.callback(req, res);
  }
  else{
      return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
  }


};







module.exports.callback = callback;