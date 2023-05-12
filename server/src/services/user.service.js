/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
var userDao = require('../dao/user.dao');
const logger = require('../config/logger');
const fetchWrapper = require('../config/fetch-wrapper');
const usersModel = require('../models/users');
var referralUrl = process.env.REFERRAl_URL;
var referralAuth = process.env.RERERRAL_TOKEN;
const { createAudit } = require('./audit.service');
const mappingService = require('./mapping.service');
const userService = require('./user.service');
const constant = require('../config/constants');
var helperService = require('./helper.service');
var fhirAppUrl = process.env.FHIREDAPP_URL;
const { sendEmail } = require('./email.service');
const notificationTemplateService = require('./notification-template.service');
const { domain } = require('../config/constants');

var getPatientFHIRInfo = async function (data) {
  try {
    const header = {};
    const response = await fetchWrapper.post(
      `${fhirAppUrl}/api/users/getFhirData?app=fs`,
      data,
      header
    );
    console.log('getPatientFHIRInfo', response);
    return response;
  } catch (e) {
    logger.error(`user : service : getPatientFHIRInfo : Error : ${e}`);
    throw e;
  }
};

var getRefToken = async function (req,res){
   const authHeader = { Authorization: referralAuth };
  const refResponse = await fetchWrapper.post(
      `${referralUrl}/api/user/getRefToken`,{email:req.decoded.email},authHeader
    );
  
  return refResponse;
  }

var login = async function (req, res) {
  logger.info(`user : service : login : received request`);
  try {
    const dToken = Buffer.from(
      req.headers.authorization.split('basic ')[1],
      'base64'
    ).toString('binary');
    let email = dToken.substring(0, dToken.indexOf(':'));
    email = email.toLowerCase();
    req.headers.email = email;
    let users = await userService.getUserByEmailId(req, res);
    users = (users)?users:{};
    var userInformation = JSON.parse(JSON.stringify(users));
    if (userInformation && Object.keys(userInformation).length > 0) {
      if (!userInformation.isLocked || userInformation.isLocked !== true) {
        const response = await fetchWrapper.post(
          `${process.env.CORE_SERVICES_API_BASE_URL}/users/login?app=fs`,
          {},
          { Authorization: req.headers.authorization }
        );
        if (response && response.status && response.status === 401) {
          if (
            userInformation &&
            userInformation.lockCount &&
            userInformation.lockCount === 4
          ) {
            let update = await userDao.update(userInformation._id, {
              isLocked: true,
            });
          } else {
            let count = 0;
            if (userInformation.lockCount) {
              count = userInformation.lockCount;
            }
            count = count + 1;

            let update = await userDao.update(userInformation._id, {
              lockCount: count,
            });
          }

          return {status:false,message:'Unauthorized login user'};
          // return res.status(401).json({
          //   message: 'Unauthorized login user',
          // });
        } else {
          let update = await userDao.update(userInformation._id, {
            token:response.access_token,
            lockCount: 0,
          });
        }
        var msgConfig = constant.msgConfig;
        var userRole = userInformation.role.role.toLowerCase();
        let performerName = await helperService.returnName(userInformation);

        var contextObject = {
          performer: performerName,
          onBehalfOf: '',
          assignedTo: '',
          documentName: '',
        };
        const msgTemplate = msgConfig['logged_in']['en'];
        const auditMessage = await helperService.compileTemplate(
          msgTemplate,
          contextObject
        );
        const msgTemplate_sp = msgConfig['logged_in']['sp'];
        const auditMessage_sp = await helperService.compileTemplate(
          msgTemplate_sp,
          contextObject
        );

        var metaObject = {
          patient: '',
          cbo: '',
          chw: '',
          documentName: '',
          module: 'Authentication',
          moduleId: '',
          subModule: 'Authentication',
          subModuleId: '',
          message_en: auditMessage,
          message_sp: auditMessage_sp,
        };
        metaObject[userRole] = userInformation._id.toString();

        let auditObject = {
          system: 'FHIRedSHIP',
          action: 'logged_in',
          meta: metaObject,
          actionData: [
            {
              name: 'session_state',
              value: req.headers['session_state']
                ? req.headers['session_state']
                : '',
            },
            { name: 'timestamp', value: new Date() },
          ],
          platform: req.headers['platform'],
          source: 'FHIRedSHIP',
          entity: 'Authentication',
          documentId: userInformation._id.toString(),
          change: [],
          createdBy: userInformation._id.toString(),
        };
        console.log('auditObject -', auditObject);
        var auditResponse = await createAudit(auditObject);

        return response;
      } else {
        var notificationTemplates = await notificationTemplateService.findAll({
          name: 'Reset Password',
        });
        if (notificationTemplates && notificationTemplates.length !== 0) {
          let notification = notificationTemplates[0];
          const msgTemplate = notification.message;
          let encEmail = Buffer.from(userInformation.email).toString('base64');
          let pagelink = `${domain.fs}/reset/${encEmail}`;
          const message = await helperService.compileTemplate(msgTemplate, {
            pagelink: pagelink,
          });
          await sendEmail({
            system: 'FHIRedSHIP',
            from: process.env.SMTP_FROM,
            replyTo: process.env.SMTP_REPLY_TO,
            to: [userInformation.email],
            subject: notification.title,
            html: message,
          });
        }


        return {status:false,message: 'Your account is locked after 4 failed password attempts.Please check you email to reset password.'};

        // return res.status(400).json({
        //   message:
        //     'Your account is locked after 4 failed password attempts.Please check you email to reset password.',
        // });
      }
    }
    else{
    // return res.status(401).json({ message: 'User not found' });
    return {"status":false,message:'User not found'};
    }
    // return res.status(500).json({ message: 'User not found' });
  } catch (e) {
    logger.error(`user : service : login : Error : ${e}`);
    throw e;
  }
};

var reset = async function (req, res) {
  logger.info(`user : service : reset : received request`);
  try {
    const dToken = Buffer.from(
      req.headers.authorization.split('basic ')[1],
      'base64'
    ).toString('binary');
    let email = dToken.substring(0, dToken.indexOf(':'));
    email = email.toLowerCase();
    req.headers.email = email;
    const users = await userService.getUserByEmailId(req, res);
    var userInformation = JSON.parse(JSON.stringify(users));
    if (userInformation) {
      console.log('userInformation', userInformation);
      const response = await fetchWrapper.post(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/reset?app=fs`,
        {},
        { Authorization: req.headers.authorization }
      );
      console.log('in response', response);
      if (response && response.username) {
        let update = await userDao.update(userInformation._id, {
          lockCount: 0,
          isLocked: false,
        });
      }

      return response;
    }
  } catch (e) {
    logger.error(`user : service : reset : Error : ${e}`);
    throw e;
  }
};

var captureLogoutAudit = async function (req, userInformation, res) {
  req.headers.email = req.query.email.toLowerCase();
  const users = await userService.getUserByEmailId(req, res);
  var userInformation = JSON.parse(JSON.stringify(users));
  var msgConfig = constant.msgConfig;
  var userRole = userInformation.role.role.toLowerCase();
  let performerName = await helperService.returnName(userInformation);
  var contextObject = {
    performer: performerName,
    onBehalfOf: '',
    assignedTo: '',
    documentName: '',
  };
  const msgTemplate = msgConfig['logged_out']['en'];
  const auditMessage = await helperService.compileTemplate(
    msgTemplate,
    contextObject
  );
  const msgTemplate_sp = msgConfig['logged_out']['sp'];
  const auditMessage_sp = await helperService.compileTemplate(
    msgTemplate_sp,
    contextObject
  );

  var metaObject = {
    patient: '',
    cbo: '',
    chw: '',
    documentName: '',
    module: 'Authentication',
    moduleId: '',
    subModule: 'Authentication',
    subModuleId: '',
    message_en: auditMessage,
    message_sp: auditMessage_sp,
  };
  metaObject[userRole] = userInformation._id.toString();

  let auditObject = {
    system: 'FHIRedSHIP',
    action: 'logged_out',
    meta: metaObject,
    actionData: [
      {
        name: 'session_state',
        value: req.headers['session_state'] ? req.headers['session_state'] : '',
      },
      { name: 'timestamp', value: new Date() },
    ],
    platform: req.headers['platform'],
    source: 'FHIRedSHIP',
    entity: 'Authentication',
    documentId: userInformation._id.toString(),
    change: [],
    createdBy: userInformation._id.toString(),
  };
  console.log('auditObject -', auditObject);
  var auditResponse = await createAudit(auditObject);
  return auditResponse;
};

var logout = async function (req, res) {
  logger.info(`user : service : logout : received request`);

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.includes('bearer ')
    ) {
      let userInfo = await fetchWrapper.get(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/getUserInfoByToken`,
        { authorization: req.headers.authorization }
      );
      await captureLogoutAudit(req, userInfo, res);
      if (userInfo == undefined) {
        return true;
      } else {
        const response = await fetchWrapper.post(
          `${process.env.CORE_SERVICES_API_BASE_URL}/users/logout?app=fs`,
          { id: userInfo.sub },
          { Authorization: req.headers.authorization }
        );
        return true;
      }
    } else {
      await captureLogoutAudit(req, userInfo, res);
    }
    logger.error(
      `user : service : getUserInfoByToken : Authorization token not found`
    );
  } catch (e) {
    logger.error(`user : service : logout : Error : ${e}`);
    throw e;
  }
};

var getUserByEmailId = async function (req, res) {
  var response = await userDao.getUserByEmailId(req, res);
  return response;
};

// var linkAccount = async function (req, res) {
//   const authHeader = { Authorization: referralAuth };
//   let curEmail = req.body.curEmail;
//   let refEmail = req.body.refEmail;
//   let facility = req.body.facility;
//   const userRes = await fetchWrapper.post(
//     `${referralUrl}/api/user/link`,
//     { email: refEmail, type: 'user', facility },
//     authHeader
//   );

//   let linkId = '';
//   if (userRes && userRes.uuid) {
//     linkId = userRes.uuid;
//     const user = await usersModel.findOneAndUpdate(
//       {
//         email: curEmail,
//       },
//       {
//         $set: {
//           uuid: linkId,
//           uuidLinked: true,
//         },
//         updatedAt: new Date(),
//         updatedBy: res.locals.userId,
//       },
//       { new: true }
//     );

//     await mappingService.save({
//       linkedWith: userRes._id,
//       uid: linkId
//     });

//     if (user) {
//       createAudit({
//         system: 'FHIRedSHIP',
//         action: 'AccountLink',
//         actionData: [
//           { name: 'email', value: refEmail },
//           {
//             name: 'session_state',
//             value: req.headers['session_state']
//               ? req.headers['session_state']
//               : '',
//           },
//           { name: 'timestamp', value: new Date() },
//         ],
//         meta: {},
//         platform: 'FHIRedSHIP',
//         source: 'FHIRedSHIP',
//         entity: 'user',
//         documentId: user._id,
//         change: [],
//         createdBy: res.locals.userId || res.locals.adminId,
//       });

//       return { status: true, linkId: linkId };
//     }
//   } else {
//     return { status: false };
//   }
// };

var create = async function (req, res) {
  var response = await userDao.create(req, res);
  return response;
};

var getActivity = async function (req, res) {
  try {
    var str = req.url;
    var qryParam = '';
    let arr = str.split('?');
    if (arr.length > 0) {
      qryParam = arr[1];
    }
    const userRes = await fetchWrapper.get(
      `${process.env.CORE_SERVICES_API_BASE_URL}/users/activity?${qryParam}`,
      {},
      { Authorization: req.headers.authorization }
    );
    if (userRes) {
      return userRes;
    } else {
      return [];
    }
  } catch (e) {
    logger.error(`user : controller : getActivity : Error : ${e}`);
  }
};

var getExchangeToken = async function (req, res, next) {
  logger.info(`user : service : getExchangeToken : received request`);
  try {
    let headers = {
      'token-type': 'refreshToken',
      Authorization: req.cookies.auth_token
        ? 'bearer ' + req.cookies.auth_token.refresh_token
        : req.headers.authorization,
      isExchangeToken: 'true',
    };
    const response = await fetchWrapper.post(
      `${process.env.LEAP_EXCHANGE_TOKEN_URL}/users/exchangeToken?app=fs`,
      {},
      {
        ...headers,
      }
    );
    
    const userInfo = await fetchWrapper.get(
        `${process.env.CORE_SERVICES_API_BASE_URL}/users/getUserInfoByToken`,
        { authorization: "bearer "+response.access_token}
      );

     let update = await usersModel.update({email:userInfo.email},{$set:{token:response.access_token}});
    createAudit({
      system: 'FHIRedSHIP',
      action: 'PatientAuth',
      actionData: [
        { name: 'email', value: req.body.email },
        {
          name: 'session_state',
          value: req.headers['session_state']
            ? req.headers['session_state']
            : '',
        },
        { name: 'timestamp', value: new Date() },
      ],
      meta: {},
      platform: 'FHIRedSHIP',
      source: 'FHIRedSHIP',
      entity: 'user',
      documentId: res.locals.userId || '',
      change: [],
      createdBy: res.locals.userId || '',
    });

    return response;
  } catch (e) {
    logger.error(`user : service : getExchangeToken : Error : ${e}`);
    throw e;
  }
};

var search = async function (req, res) {
  logger.info(`user : service : search : received request`);
  try {
    var response = await userDao.search(req, res);
    return response;
  } catch (e) {
    logger.error(`user : service : search : Error : ${e}`);
    throw e;
  }
};
module.exports.getRefToken = getRefToken;
module.exports.search = search;
module.exports.reset = reset;
module.exports.getActivity = getActivity;
// module.exports.linkAccount = linkAccount;
module.exports.create = create;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getUserByEmailId = getUserByEmailId;
module.exports.getExchangeToken = getExchangeToken;
module.exports.getPatientFHIRInfo = getPatientFHIRInfo;
