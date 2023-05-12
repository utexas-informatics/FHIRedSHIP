var logger = require('../config/logger');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');
var { createAudit } = require('../services/audit.service');
var helperService = require('../services/helper.service');
 
var generateAudit = async function (req, res, next) {
  logger.info(`audit : controller : generateAudit : received request`);
  try {

    var response = await createAudit({
      system: 'FHIRedSHIP',
      action: req.body.action,
      actionData: [
        ...req.body.actionData,
        {
          name: 'session_state',
          value: req.headers['session_state']
            ? req.headers['session_state']
            : '',
        },
        { name: 'timestamp', value: new Date() },
      ],
      platform: req.headers['platform'], // TBD - need to get this info from req
      source: req.headers['source'], // TBD - need to get this info from req
      entity: req.body.entity,
      documentId: req.body.createdBy || res.locals.userId,
      change: [...req.body.change],
      createdBy: req.body.createdBy || res.locals.userId,
    });
    res
      .status(200)
      .json({ message: 'audit created successfully', _id: response });
  } catch (e) {
    var error = 'Failed to create custom Audit';
    logger.error(`audit : controller : generateAudit : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var callback = async function (req, res, next) {
  logger.info(`audit : controller : callback : received request`);
  try {
     let auditRef=req.body;
     var patientId='';
     var cboId='';
     var chwId='';
     console.log('-auditRef->>>>>>>>>>>>>',auditRef);
     
     if(auditRef.meta.patient){
     var patientQuery={ 'sid':  auditRef.meta.patient};
     //patientQuery['$or'] = [{ 'sid':  auditRef.meta.patient},{ 'uuid':  auditRef.meta.patient}];
     const patient = await helperService.getUser(patientQuery,'_id'); 
     patientId=patient.toString();
     }
      if(auditRef.meta.cbo){
     var cboQuery={ 'uuid':  auditRef.meta.cbo};
    // cboQuery['$or'] = [{ 'sid':  auditRef.meta.cbo},{ 'uuid':  auditRef.meta.cbo}];
     const cbo = await helperService.getUser(cboQuery,'_id'); 
     cboId=cbo.toString();
     }

     if(auditRef.meta.chwQuery){
     var chwQuery={ 'uuid':  auditRef.meta.chw};
     //chwQuery['$or'] = [{ 'sid':  auditRef.meta.chw},{ 'uuid':  auditRef.meta.chw}];
     const chw = await helperService.getUser(chwQuery,'_id'); 
     chwId=chw.toString();
     }


     var msgConfig=constants.msgConfig;
     let action=auditRef.action;
     let msgTemplate=msgConfig[action];

     

     var metaObject={
       'patient':patientId,
       'cbo':cboId,
       'chw':chwId,
       'documentName':auditRef.documentName?auditRef.documentName:'',
       'module':'',
       'moduleId':'',
       'subModule':'',
       'subModuleId':'',
       'message':'',
     }
/*
     const auditMessage = await helperService.compileTemplate(msgTemplate,metaObject);
     metaObject['message']=auditMessage;

     let createdById= helperService.returnValueByKey(metaObject,auditRef.createdByType);
     let identifierValue= helperService.returnValueByKey(metaObject,auditRef.identifier);

  

     let finalObject={
              system: 'FHIRedSHIP',
              action: `${auditRef.action}`,
             meta:metaObject,
              actionData: [
                {
                  name: 'session_state',
                  value: req.headers['session_state']
                    ? req.headers['session_state']
                    : '',
                },
                { name: auditRef.identifier, value: identifierValue },
                { name: 'timestamp', value: new Date() },
              ],
              platform: 'FHIRedSHIP',
              source: 'FHIRedSHIP',
              entity: auditRef.entity,
              documentId: auditRef.documentId,
              change: [],
              createdBy: createdById,
            };

    console.log(' finalObject -------> ',finalObject);

createAudit(finalObject);*/



   /* var response = await createAudit({
      system: 'FHIRedSHIP',
      action: req.body.action,
      actionData: [
        ...req.body.actionData,
        {
          name: 'session_state',
          value: req.headers['session_state']
            ? req.headers['session_state']
            : '',
        },
        { name: 'timestamp', value: new Date() },
      ],
      platform: req.headers['platform'],
      source: req.headers['source'], 
      entity: req.body.entity,
      documentId: req.body.createdBy || res.locals.userId,
      change: [...req.body.change],
      createdBy: req.body.createdBy || res.locals.userId,
    });
    res
      .status(200)
      .json({ message: 'audit created successfully', _id: response });*/
  } catch (e) {
    var error = 'Failed to create custom Audit';
    logger.error(`audit : controller : callback : Error : ${e}`);
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};


module.exports.callback = callback;
module.exports.generateAudit = generateAudit;
