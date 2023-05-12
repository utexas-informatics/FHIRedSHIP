var conditionService = require('../services/condition.service');
var errorResponse = require('../config/error-response');
var constants = require('../config/constants');
var helperService = require('../services/helper.service');
var userService = require('../services/user.service');
const notificationService = require('../services/notification.service');
const auditService = require('../services/audit.service');

var getConditions = async function (req, res, next) {
  try {
    var conditionResponse = await conditionService.getConditions(req, res);
    var helperResp = await helperService.convertResourceToFhirToBundle(
      conditionResponse
    );
    res.json(helperResp);
  } catch (e) {
    var error = 'Failed to get by id getConditionsByResp';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getConditionByPatient = async function (req, res, next) {
  try {
    var conditionResponse = await conditionService.getConditionByPatient(
      req,
      res
    );
    res.json(conditionResponse);
  } catch (e) {
    var error = 'Failed to get by id getConditionsByResp';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var getConditionsByResp = async function (req, res, next) {
  try {
    var conditionResponse = await conditionService.getConditionsByResp(
      req,
      res
    );
    /*let aid=questionnaireresponse.questionnaireId;*/
    var helperResp = await helperService.convertFhirToJsonCondition(
      conditionResponse
    );

    let result = { condition: helperResp };

    res.json(result);
  } catch (e) {
    var error = 'Failed to get by id getConditionsByResp';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var remove = async function (req, res, next) {
  try {
    var removeResponse = await conditionService.remove(req, res);
    res.json(removeResponse);
  } catch (e) {
    var error = 'Failed to remove condition';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var save = async function (req, res, next) {
  try {
    var data = req.body;
    /*var helperResp = await helperService.convertToFhirCondition(data);

    let dataObject={
      data:{},
      sid: data.sid,
      user: data.user,
      questionnaireresponsId:data.questionnaireresponsId,
    }*/
    //var conditionResponse = await conditionService.save(data);

    let userQuery = { uuid: req.body.user };
    var user = await userService.getUser(userQuery);
    if (user) {
      req.body.user = user._id.toString();
    }
    var isCodeValid = await helperService.checkCode(data.code, data.desc);

    if (isCodeValid !== true) {
      return res.send({ error: true, message: `Invalid code` });
    }

    var conditionResponse = await conditionService.save({});
    data._id = conditionResponse._id;
    var helperResp = await helperService.convertToFhirCondition(data);
    let _id = conditionResponse._id;
    helperResp['id'] = _id.toString();
    const patQuery = { sid: data.sid };
    var pat = await userService.getUser(patQuery);
    const object = {};
    const dataObject = {
      desc: data.desc,
      note: data.need,
      code: data.code,
      data: helperResp,
      sid: data.sid,
      user: data.user,
      patId: pat ? pat._id.toString() : '',
      questionnaireResponse: data.questionnaireresponsId,
    };

    var conditionUpdateResponse = await conditionService.update(
      { _id: _id },
      dataObject
    );

    // const notification = { ...constants.notification };
    //      notification.sender.id = userQuery.uuid;
    //      notification.sender.type = 'Chw';
    //      notification.meta.assignedTo=req.body.sid;
    //      notification.meta.onBehalfOf='';
    //      notification.meta.performer=userQuery.uuid;
    //      notification.meta.documentName='Food';
    //      notification.type = 'condition_created';
    //      notification.meta.module = 'QuestionnaireResponse';
    //      notification.meta.moduleId = req.body.questionnaireresponsId;
    //      notification.meta.subModule = 'Condition';
    //      notification.meta.subModuleId = '';
    //      notification.meta.entity = "Condition";
    //      notification.meta.auditType = "Condition";
    //      notification.meta.action = "condition_created";
    //      notification.receiver = [{ id: req.body.sid, type: 'Patient' }];
    //      console.log("notification-----//////-->",JSON.stringify(notification));

    //      notificationService.callBackRequest(notification);

    res.json(conditionResponse);
  } catch (e) {
    var error = 'Failed to save condition';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.getConditionByPatient = getConditionByPatient;
module.exports.getConditions = getConditions;
module.exports.save = save;
module.exports.getConditionsByResp = getConditionsByResp;
module.exports.remove = remove;
