/* eslint-disable linebreak-style */
module.exports = Object.freeze({
  environments: ['development', 'test', 'production'],
  error: {
    notFound: { status: 404, type: 'Not Found' },
    internalServerError: { status: 500, type: 'Internal Server Error' },
    badRequest: { status: 400, type: 'Bad Request' },
    unauthorized: { status: 401, type: 'unauthorized' },
  },
  coreServicesEndpoints: {
    createAudit: `/audits`,
    sendEmail: `/email`,
  },
  notification:{
    sender:{id:'' ,type:''},
    receiver:[],
    type:'',
    meta:{
    module:'',
    moduleId:'',
    documentName : "",
    subModule : "",
    subModuleId : "",
    auditType:""
    }
  }
});
