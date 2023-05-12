/* eslint-disable linebreak-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-destructuring */
const logger = require('../config/logger');
const errorResponse = require('../config/error-response');
const constants = require('../config/constants');
var appointmentDao = require('../dao/appointment.dao');
const fetchWrapper = require('../config/fetch-wrapper');
const helperService = require('./helper.service');
const notificationDao = require('../dao/notification.dao');

var callback = async function (req, res, next) {

  const payload = req.body.payload;
  const currentEvent = req.body.event;
  const meta = payload.tracking;
  const calType = meta.utm_content;

  const appointmentData = {
    eventUrl: payload.event.replaceAll(' ', ''),
    name: '',
    invitee: meta.utm_term,
    referral: meta.utm_source,
    cancelUrl: payload.cancel_url.replaceAll(' ', ''),
    reScheduleUrl: payload.reschedule_url.replaceAll(' ', ''),
    status: payload.status,
    startDate: '',
    endDate: '',
    token: '',
  };
  if (meta.utm_campaign && meta.utm_campaign !== 'null') {
    appointmentData.cbo = meta.utm_campaign;
  }

  if (meta.utm_medium && meta.utm_medium !== 'null') {
    appointmentData.chw = meta.utm_medium;
  }

  const appReq = {};
  appReq.body = {
    eventUrl: appointmentData.eventUrl,
  };
  const notification = {};
  let apptRes = await appointmentDao.getOne(appReq, res);
  

  if (currentEvent === 'invitee.created') {
    if (!apptRes) {
      let userData = null;
      if (calType === 'cbo') {
        userData = await helperService.getUserDetails({
          _id: appointmentData.cbo,
        });
      } else {
        userData = await helperService.getUserDetails({
          _id: appointmentData.chw,
        });
      }

      let eventData = null;
  
      if (
        userData &&
        userData.appointmentData &&
        userData.appointmentData.access_token
      ) {
        appointmentData.token = userData.appointmentData.access_token;
        const authHeader = { Authorization: `Bearer ${appointmentData.token}` };
      
        eventData = await fetchWrapper.get(
          appointmentData.eventUrl,
          authHeader
        );
    
        if (eventData && eventData.resource) {
          appointmentData.name = eventData.resource.name;
          appointmentData.startDate = eventData.resource.start_time;
          appointmentData.endDate = eventData.resource.end_time;
        }
      }
      appReq.body = appointmentData;
      await appointmentDao.save(appReq, res);

      appReq.body = { eventUrl: appointmentData.eventUrl };
      apptRes = await appointmentDao.getOne(appReq, res);
      let behalfOf = '';
      let performerType = 'Patient';
      notification.type = 'appointment_created';
      notification.sender = {
        id: apptRes.invitee && apptRes.invitee.sid ? apptRes.invitee.sid : '',
        type: 'Patient',
      };

      behalfOf = apptRes.chw && apptRes.chw.uuid ? apptRes.chw.uuid : '';
      notification.receiver = [
        {
          id: apptRes.cbo && apptRes.cbo.uuid ? apptRes.cbo.uuid : '',
          type: 'Cbo',
        },
      ];

      if (!apptRes.chw || !apptRes.cbo) {
        behalfOf = '';
        notification.type = 'appointment_created_patient';
        notification.receiver = [
          {
            id:
              apptRes.invitee && apptRes.invitee.sid ? apptRes.invitee.sid : '',
            type: 'Patient',
          },
        ];
        if (apptRes.chw) {
          performerType = 'Chw';
          notification.sender = {
            id: apptRes.chw && apptRes.chw.uuid ? apptRes.chw.uuid : '',
            type: 'Chw',
          };
        }

        if (apptRes.cbo) {
          performerType = 'Cbo';
          notification.sender = {
            id: apptRes.cbo && apptRes.cbo.uuid ? apptRes.cbo.uuid : '',
            type: 'Cbo',
          };
        }
      }

      notification.meta = {
        module: 'Referral',
        moduleId: apptRes.referral,
        assignedTo: notification.receiver[0].id,
        onBehalfOf: behalfOf,
        performer: notification.sender.id,
        performerType: performerType,
        date: apptRes.startDate,
        type: 'schedule_created',
        auditType: 'Schedule',
        entity: 'Schedule',
      };
      const nReq = {};
      nReq.body = notification;
      notificationDao.callback(nReq, res);
    }
  } else {
    if (apptRes) {
      if (apptRes.status !== appointmentData.status) {
        appReq.body = {
          id: apptRes._id,
          data: { status: appointmentData.status, updatedAt: new Date() },
        };
        await appointmentDao.update(appReq, res);
       
        let behalfOf = '';
        let performerType ="";
     if(apptRes.updatedBy && apptRes.updatedBy != ""){
        
        let updatedByUser = await helperService.getUserDetails({
          _id: apptRes.updatedBy,
        });

 
        
        let userUpdateByType = updatedByUser._doc.role._doc.role.toString();
  

        if(userUpdateByType == "Cbo"){
          performerType = 'CBO';
         notification.sender = {
              id: updatedByUser._doc.uuid ? updatedByUser._doc.uuid : '',
              type: userUpdateByType,
            };

         }
         else if(userUpdateByType == "Chw"){
            performerType = 'CHW';
           notification.sender = {
              id: updatedByUser._doc.uuid ? updatedByUser._doc.uuid : '',
              type: userUpdateByType,
            };

         }
         else{
          performerType = 'Patient';
          notification.sender = {
              id: updatedByUser._doc.sid ? updatedByUser._doc.sid : '',
              type: userUpdateByType,
            };

         }

    
       let uuid = "";
       let userType = "";


        if(performerType == "Patient"){

   
        
         if (apptRes.chw && apptRes.cbo) {

         behalfOf = apptRes.chw && apptRes.chw.uuid ? apptRes.chw.uuid : '';
         notification.type = 'group_appointment_updated_by_patient';
          uuid = apptRes.cbo && apptRes.cbo.uuid? apptRes.cbo.uuid: '';
          userType = "Cbo";
         }
         else{
         if(apptRes.chw){
           notification.type = 'appointment_updated_by_patient_for_chw';
           uuid = apptRes.chw && apptRes.chw.uuid? apptRes.chw.uuid: '';
           userType = "Chw";
         }
         else if(apptRes.cbo){
           notification.type = 'appointment_updated_by_patient_for_cbo';
           uuid = apptRes.cbo && apptRes.cbo.uuid? apptRes.cbo.uuid: '';
           userType = "Cbo";
         }

        }
         
        notification.receiver = [
            {
              id:uuid,
              type: userType,
            },
          ];

        }
        else if(performerType == "CHW"){
 
        if (apptRes.chw && apptRes.cbo) {
        notification.type = 'group_appointment_updated_by_chw';
        behalfOf = apptRes.cbo && apptRes.cbo.uuid ? apptRes.cbo.uuid : '';
        uuid =  apptRes.invitee && apptRes.invitee.sid? apptRes.invitee.sid: '';
        userType = "Patient";

        }
        else{

        notification.type = 'appointment_updated_by_chw_for_patient';
         uuid =  apptRes.invitee && apptRes.invitee.sid? apptRes.invitee.sid: '';
         userType = "Patient";
        }

         notification.receiver = [
            {
              id:uuid,
              type: userType,
            },
          ];
        
        }
        else{
        if (apptRes.chw && apptRes.cbo) {
        notification.type = 'group_appointment_updated_by_cbo';
        behalfOf = apptRes.chw && apptRes.chw.uuid ? apptRes.chw.uuid : '';
        uuid =  apptRes.invitee && apptRes.invitee.sid? apptRes.invitee.sid: '';
        userType = "Patient";

        }
        else{
        notification.type = 'appointment_updated_by_cbo_for_patient';
         uuid =  apptRes.invitee && apptRes.invitee.sid? apptRes.invitee.sid: '';
         userType = "Patient";
        }

        
         notification.receiver = [
            {
              id:uuid,
              type: userType,
            },
          ];
       
       }

     }
        

        notification.meta = {
          module: 'Referral',
          moduleId: apptRes.referral,
          assignedTo: notification.receiver[0].id,
          onBehalfOf: behalfOf,
          performer: notification.sender.id,
          performerType: performerType,
          date: apptRes.startDate,
          status: appointmentData.status,
          type: 'schedule_cancelled',
          auditType: 'Schedule',
          entity: 'Schedule',
        };
        const nReq = {};
        nReq.body = notification;
        notificationDao.callback(nReq, res);
      }
    }
  }
  return {"status":true};
};

const getAll = async (req, res) => {
  logger.info(`appointment : service : getAll : received request`);
  try {
    const response = await appointmentDao.getAll(req, res);
    return response;
  } catch (e) {
    logger.error(`appointment : service : getAll : Error : ${e}`);
    throw e;
  }
};

const cancel = async (req, res) => {
  logger.info(`appointment : service : cancel : received request`);
  try {
    const response = await appointmentDao.cancel(req, res);
    return response;
  } catch (e) {
    logger.error(`appointment : service : cancel : Error : ${e}`);
    throw e;
  }
};

module.exports.cancel = cancel;
module.exports.getAll = getAll;
module.exports.callback = callback;
