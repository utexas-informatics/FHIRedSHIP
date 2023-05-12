var errorResponse = require('../config/error-response');
var constants = require('../config/constants');
var helperService = require('../services/helper.service');
const notificationService = require('../services/notification.service');
const fileuploadService = require('../services/fileupload.service');
var fs = require('fs');
const { createAudit } = require('../services/audit.service');
var userService = require('../services/user.service');
 
var uploadFile = async function (req, res, next) {
  try {
    if(!req.file.originalname){
      throw new Error(`Error while uploading file`);
    }

    if(!helperService.isFileAllowed(req.file.originalname)){
      throw new Error(`File format not supported`);
    }
  var path='../uploads'
  var oldFile=req.file.filename
  var newFile=oldFile+req.file.originalname;
  let fileName='';
  fs.rename(path+'/'+oldFile, path+'/'+newFile, async function (err) {
  if (err) {
    return res.send({'error':err});
  }
  var uploadObject={
    name:newFile,
    originalName:req.file.originalname,
    linking:req.query.linking?req.query.linking:''
  };
   var fileuploaResponse = await fileuploadService.save(uploadObject);
   

req.headers.email=req.query.email;
   const users = await userService.getUserByEmailId(req, res);
  var userInformation=JSON.parse(JSON.stringify(users));
  var userRole=userInformation.role.role.toLowerCase();
  let performerName = await helperService.returnName(userInformation);

     var contextObject = {
      performer: performerName,
      onBehalfOf: '',
      assignedTo: '',
      documentName: uploadObject.originalName,
    };



    var metaInfo = { ...constants.defaultMetaJson};
    metaInfo.moduleId=req.query.linking;
    metaInfo.module="Referral";
    metaInfo.documentName=uploadObject.originalName;
    metaInfo.documentId=req.query.linking;
    metaInfo.subModule="FileUpload";
    metaInfo.action="uploaded_file";
    metaInfo.entity="Fileupload";
    metaInfo.auditType="referral";

   let auditResp =  await helperService.saveAuditData(req,metaInfo,userInformation._id.toString(),userRole,contextObject);


   res.status(200).json({status:true,data:fileuploaResponse});
   //return res.send({'name':newFile}); 
 
})
  
  } catch (e) {
    var error = 'Failed to upload file';
    res.status(500).json({status:false,data:{},msg:e.message});
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var get = async function (req, res, next) {
  try {
   var fileResponse = await fileuploadService.get(req);
   res.status(200).json(fileResponse);
  } catch (e) {
    var error = 'Failed to upload file';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

var remove = async function (req, res, next) {
  try {
   var fileResponse = await fileuploadService.remove(req);

req.headers.email=(req.decoded._doc)?req.decoded._doc.email:req.decoded.email;
   const users = await userService.getUserByEmailId(req, res);
  var userInformation=JSON.parse(JSON.stringify(users));
var userRole=userInformation.role.role.toLowerCase();
 let performerName = await helperService.returnName(userInformation);
    var contextObject = {
      performer: performerName,
      onBehalfOf: '',
      assignedTo: '',
      documentName: req.query.file,
    };

    var metaInfo = {...constants.defaultMetaJson};
    
    metaInfo.moduleId=req.query.linking;
    metaInfo.module="Referral";
    metaInfo.documentName=req.query.file;
    metaInfo.documentId=req.query.linking;
    metaInfo.subModule="FileUpload";
    metaInfo.action="deleted_file";
    metaInfo.entity="Fileupload";
    metaInfo.auditType="referral";
   
    
    //var msgConfig = constants.msgConfig;


    // var contextObject = {
    //   performer: userInformation.email,
    //   onBehalfOf: '',
    //   assignedTo: '',
    //   documentName: req.query.file,
    // };
    //  const msgTemplate = msgConfig['deleted_file']['en'];
    //  const auditMessage = await helperService.compileTemplate(msgTemplate,contextObject);
    //  const msgTemplate_sp = msgConfig['deleted_file']['sp'];
    //  const auditMessage_sp = await helperService.compileTemplate(msgTemplate_sp,contextObject);

    //   var metaObject={
    //     "patient" : "",
    //     "cbo" : "",
    //     "chw" : "",
    //     "documentName" : req.query.file,
    //     "module" : "Referral",
    //     "moduleId" : req.query.linking,
    //     "subModule" : "FileUpload",
    //     "subModuleId" : '',
    //     "message_en" : auditMessage,
    //     "message_sp" : auditMessage_sp
    // };
    // metaObject[userRole]=userInformation._id.toString();

    // let auditObject={
    //   system: 'FHIRedSHIP',
    //   action: 'deleted_file',
    //   meta:metaObject,
    //   actionData: [
    //     {
    //       name: 'session_state',
    //       value: req.headers['session_state']
    //         ? req.headers['session_state']
    //         : '',
    //     },
    //     { name: 'timestamp', value: new Date() },
    //   ],
    //   platform: req.headers['platform']?req.headers['platform']:'web', 
    //   source: 'FHIRedSHIP', 
    //   entity: 'Referral',
    //   documentId: req.query.linking,
    //   change: [],
    //   createdBy: userInformation._id.toString() ,
    // };
    // var auditResponse = await createAudit(auditObject);

  
    let auditResponse =  await helperService.saveAuditData(req,metaInfo,userInformation._id.toString(),userRole,contextObject);


   res.status(200).json({status:true,data:fileResponse});
  } catch (e) {
      res.status(500).json({status:true,data:{},msg:e.message});
    var error = 'Failed to remove file';
    next(
      errorResponse.build(constants.error.internalServerError, error, e.message)
    );
  }
};

module.exports.remove = remove;
module.exports.get = get;
module.exports.uploadFile = uploadFile;