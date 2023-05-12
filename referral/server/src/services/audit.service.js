const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');

const fsUrl = process.env.FS_URL;
const fsAuth = process.env.FS_AUTH;


var auditCallBackRequest = async function (data) {
    const header = { Authorization: fsAuth };
    const response = await fetchWrapper.post(
        `${fsUrl}/api/audit/callback`,
        data,
        header
      );
      return true;
  };


  module.exports.auditCallBackRequest = auditCallBackRequest;