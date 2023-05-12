/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');

const fsUrl = process.env.FS_URL;
const fsAuth = process.env.FS_AUTH;


var callBackRequest = async function (data) {
    const header = { Authorization: fsAuth };
    const response = await fetchWrapper.post(
        `${fsUrl}/api/notification/callback`,
        data,
        header
      );
      return {status:true};
  };


  module.exports.callBackRequest = callBackRequest;