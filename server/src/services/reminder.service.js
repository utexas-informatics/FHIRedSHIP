/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
const moment = require('moment');
const logger = require('../config/logger');
const { durationMapping, scheduleConfig } = require('../config/constants');
const helperService = require('./helper.service');
const refDao = require('../dao/referral.dao');
const notificationDao = require('../dao/notification.dao');
const mappingService = require('./mapping.service');
const respDao = require('../dao/response.dao');
const tempDao = require('../dao/template.dao');
const responseModel = require('../models/response');
const userModel = require('../models/users');
const taskModel = require('../models/task');

var returnTimeForMessage = async function (durationType, setting, baseDate) {
  let dayForMessaging = new Date();
  if (durationType === 'minute' || durationType === 'hour') {
    let adMIns = 0;
    const { span } = setting;

    if (durationType === 'hour') {
      adMIns = span * 60;
    } else if (durationType === 'minute') {
      adMIns = span;
    }
    dayForMessaging = moment(baseDate).add(adMIns, 'minutes').valueOf();
  } else {
    const mappedDays = durationMapping[durationType];

    const { span } = setting;

    const totalDays = span * mappedDays;

    dayForMessaging = moment(baseDate)
      .add(totalDays, 'days')

      .endOf('day')

      .valueOf();
  }
  return dayForMessaging;
};

var checkIterationIfApplicable = async function (
  dateTocheck,
  setting,
  setting2
) {
  let baseDate = moment(dateTocheck).startOf('day').valueOf();

  const respObject = { status: false };

  const configId = setting.id;

  var durationType = setting.ext;
  let dayForMessaging = null;
  let dayForMessaging2 = null;
  baseDate = moment(dateTocheck).valueOf();
  dayForMessaging = await returnTimeForMessage(durationType, setting, baseDate);
  console.log('dayForMessaging', dayForMessaging);

  if (setting2) {
    dayForMessaging2 = await returnTimeForMessage(
      setting2.ext,
      setting2,
      baseDate
    );
    console.log('dayForMessaging2', dayForMessaging2);
  }

  var curDate = moment().valueOf();
  console.log('curDate', curDate);

  if (dayForMessaging2) {
    if (dayForMessaging <= curDate && curDate < dayForMessaging2) {
      respObject.status = true;
    }
  } else {
    if (dayForMessaging <= curDate) {
      respObject.status = true;
    }
  }

  return respObject;
};

var referralVerification = async function () {
  console.log(`reminder : service : referralVerification : received request`);

  try {
    const curConfig = scheduleConfig.referralVerification;
    const referrals = await refDao.findAll({ patContacted: false, refStatus: 'Draft'});
    if (referrals && referrals.length !== 0) {
      for (let i = 0; i < referrals.length; i++) {
        const currentRef = referrals[i];
        const currentDate = currentRef.createdAt;
        const iteration = await checkIterationIfApplicable(
          currentDate,
          curConfig,
          ''
        );
        if (iteration.status === true) {
          const chwMapping = await mappingService.getMapping({
            linkedWith: currentRef.chw,
          });
          const patMapping = await mappingService.getMapping({
            linkedWith: currentRef.patient,
          });
          var sender = {
            role: 'Chw',
            id: chwMapping && chwMapping.uid ? chwMapping.uid : '',
          };
          var receiver = {
            id: patMapping && patMapping.uid ? patMapping.uid : '',
            role: 'Patient',
          };
          var onBehalfOf = '';
          var moduleName = 'Referral';
          var moduleId = currentRef.refId;
          var documentName = '';
          var subModuleName = '';
          var subModuleId = '';
          var auditType = 'Referral';
          var entity = 'Referral';
          var type = 'referral_patient_contacted';
          var notification = await helperService.returnNotificationJson(
            type,
            sender,
            receiver,
            onBehalfOf,
            moduleName,
            moduleId,
            documentName,
            '',
            subModuleName,
            subModuleId,
            auditType,
            entity,
            type
          );
          const nReq = {};
          notification.meta.confirmation = true;
          nReq.body = notification;
          notificationDao.callback(nReq, {});
          const updateData = {
            id: currentRef.refId,
            data: { patContacted: true },
          };
          await refDao.update(updateData);
        }
      }
    }
  } catch (e) {
    logger.error(`reminder : service : referralVerification : Error : ${e}`);

    throw e;
  }
};

var referralFollowup = async function () {
  console.log(`reminder : service : referralFollowup : received request`);

  try {
    const followUpConf1 = scheduleConfig.referralFollowup1;
    const followUpConf2 = scheduleConfig.referralFollowup2;
    const template = await tempDao.getOne({ name: 'Followup Form' });
    console.log('template', template);
    const templateId = template && template._id ? template._id : '';
    const referrals = await refDao.findAll({ status: 'HHSC Completed' });
    console.log('referrals', referrals);
    for (let i = 0; i < referrals.length; i++) {
      const currentRef = referrals[i];
      const currentDate = currentRef.updatedAt;

      const chwMapping = await mappingService.getMapping({
        linkedWith: currentRef.chw,
      });
      const patMapping = await mappingService.getMapping({
        linkedWith: currentRef.patient,
      });
      const cboMapping = await mappingService.getMapping({
        linkedWith: currentRef.cbo,
      });
      var sender = {
        role: 'Cbo',
        id: cboMapping && cboMapping.uid ? cboMapping.uid : '',
      };
      var receiver = {
        id: patMapping && patMapping.uid ? patMapping.uid : '',
        role: 'Patient',
      };
      var onBehalfOf = {
        id: cboMapping && cboMapping.uid ? cboMapping.uid : '',
        role: 'Cbo',
      };
      var moduleName = 'Referral';
      var moduleId = currentRef.refId;
      var documentName = '';
      var subModuleName = '';
      var subModuleId = '';
      var auditType = 'Referral';
      var entity = 'Referral';
      var type = 'referral_followup';
      var notification = await helperService.returnNotificationJson(
        type,
        sender,
        receiver,
        onBehalfOf,
        moduleName,
        moduleId,
        documentName,
        '',
        subModuleName,
        subModuleId,
        auditType,
        entity,
        type
      );
      notification.meta.formName = template.name;
      notification.meta.formId = templateId;
      const patDetail = await helperService.getUserDetails({
        sid: receiver.id,
      });
      const responseData = {};
      responseData.submittedBy = patDetail ? patDetail._id : '';
      responseData.moduleId = moduleId;
      responseData.data = {};
      responseData.templateId = templateId;
      notification.meta.patientId = patDetail ? patDetail._id : '';
      // const checkFollowup1 = await checkIterationIfApplicable(
      //   currentDate,
      //   followUpConf1,
      //   followUpConf2
      // );
      const checkFollowup1 = await checkIterationIfApplicable(
        currentDate,
        followUpConf1,
        ''
      );
      const checkResp = await respDao.getOne({
        moduleId: moduleId,
        templateId: templateId,
        submittedBy: responseData.submittedBy,
      });
      console.log('currentRef-->', currentRef);
      console.log('checkResp-->', checkResp);
      console.log('checkFollowup1-->', checkFollowup1);
      if (checkFollowup1.status === true) {
        if (!checkResp) {
          const resp = await responseModel.create({ ...responseData });
          notification.meta.responseId = resp._id;
          notification.meta.taskEventId = resp._id.toString();
          const nReq = {};
          nReq.body = notification;
          notificationDao.callback(nReq, {});
        } else {
          const checkFollowup2 = await checkIterationIfApplicable(
            currentDate,
            followUpConf2,
            ''
          );
          console.log('checkFollowup2-->', checkFollowup2);
          if (checkFollowup2.status === true) {
            if (checkResp && currentRef.isFollowedUp !== true) {
              if (
                !checkResp.data ||
                (checkResp.data &&
                  checkResp.data.radio001 &&
                  checkResp.data.radio001 === 'no')
              ) {
                const resp = await responseModel.create({ ...responseData });
                notification.meta.responseId = resp._id;
                notification.meta.taskEventId = resp._id.toString();
                const nReq = {};
                nReq.body = notification;
                notificationDao.callback(nReq, {});
                const updateData = {
                  id: currentRef.refId,
                  data: { isFollowedUp: true },
                };
                await refDao.update(updateData);
              }
            }
          }
        }
      } 
    }
  } catch (e) {
    logger.error(`reminder : service : referralFollowup : Error : ${e}`);

    throw e;
  }
};

var taskReminder = async function () {
  console.log("in task reminder");
  const currentDate = moment().startOf('day').valueOf();
  const users = await userModel.find({}).populate('role', 'role');
  if (users && users.length !== 0) {
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];
      const lastReminder =
        currentUser && currentUser.reminderSentAt
          ? moment(currentUser.reminderSentAt).startOf('day').valueOf()
          : null;
          console.log("in task reminder currentUser",currentUser);
      if (!lastReminder || (lastReminder && currentDate !== lastReminder)) {
        console.log("in task reminder lastReminder",lastReminder);
        var curDate = moment().toISOString();
        let query = {
          actorId: currentUser._id,
          status: { $ne: 'Complete' },
          dueDate: { $lt: curDate },
        };
        const tasks = await taskModel.find(query);
        console.log("in task reminder tasks",tasks);
        if (tasks && tasks.length !== 0) {
          let role = currentUser.role.role;
          let uid = currentUser && currentUser.uuid ? currentUser.uuid : '';
          if (role && role.toLowerCase() === 'patient') {
            uid = currentUser && currentUser.sid ? currentUser.sid : '';
          }
          var sender = {
            role: role,
            id: uid,
          };
          var receiver = {
            id: uid,
            role: role,
          };
          var onBehalfOf = {};
          var moduleName = 'Task';
          var moduleId = '';
          var documentName = '';
          var subModuleName = '';
          var subModuleId = '';
          var auditType = 'Task';
          var entity = 'Task';
          var type = `task_reminder_${role.toLowerCase()}`;
          var notification = await helperService.returnNotificationJson(
            type,
            sender,
            receiver,
            onBehalfOf,
            moduleName,
            moduleId,
            documentName,
            '',
            subModuleName,
            subModuleId,
            auditType,
            entity,
            type
          );
          notification.meta.dueDate = curDate;
          notification.meta.count = tasks.length;
          const nReq = {};
          nReq.body = notification;
          notificationDao.callback(nReq, {});
          const data = { reminderSentAt: new Date() };
          const response = await userModel.findByIdAndUpdate(
            currentUser._id,
            data,
            {
              new: true,
            }
          );
        }
      }
    }
  }
};

module.exports.taskReminder = taskReminder;
module.exports.referralFollowup = referralFollowup;
module.exports.referralVerification = referralVerification;
