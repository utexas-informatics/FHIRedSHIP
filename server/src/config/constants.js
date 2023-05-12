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
  language:'en',
  msgConfig:{
      "referral_created": {
        "en":`<b>{{performer}}</b> placed a new referral for <b>{{onBehalfOf}}</b>`,
        "sp":`<b>{{performer}}</b> colocó una nueva referencia para <b>{{onBehalfOf}}</b>`,
      },
      "referral_updated": {
        "en":`<b>{{performer}}</b> updated a referral <b>({{documentName}})</b> for {{onBehalfOf}}`,
        "sp":`<b>{{performer}}</b> actualizó una referencia <b>({{documentName}})</b> para {{onBehalfOf}}`,
      },
      "assessment_filled":{
        "en":`<b>{{performer}}</b> submitted PRAPARE Asssesment`,
        "sp":`<b>{{performer}}</b> envió una evaluación PRAPARE`,
      },
    "assessment_shared":{
        "en":`<b>{{performer}}</b> requested a PRAPARE Asssesment`,
        "sp":`<b>{{performer}}</b> solicitó una evaluación PRAPARE`,
      },
     "assessment_viewed":{
        "en":`<b>{{performer}}</b> viewed the patient assessment`,
        "sp":`<b>{{performer}}</b> vio la evaluación del paciente`,
     },
     "logged_in":{
        "en":`<b>{{performer}}</b> logged In`,
        "sp":`<b>{{performer}}</b> conectado`,
     },
     "logged_out":{
        "en":`<b>{{performer}}</b> logged Out`,
        "sp":`<b>{{performer}}</b> conectado`,
     },
      "condition_created":{
        "en":`<b>{{performer}}</b> added condition to assessment <b>{{documentName}}</b>`,
        "sp":`<b>{{performer}}</b> agregó una condición a la evaluación <b>{{documentName}}</b>`,
     },
     "uploaded_file":{
        "en":`<b>{{performer}}</b> uploaded the file <b>{{documentName}}</b> to referral`,
        "sp":`<b>{{performer}}</b> subió el archivo <b>{{documentName}}</b> a la referencia`,
     },
     "deleted_file":{
        "en":`<b>{{performer}}</b> deleted the file <b>{{documentName}}</b> under referral`,
        "sp":`<b>{{performer}}</b> eliminó el archivo <b>{{documentName}}</b> bajo referencia`,
     },
      "referral_task_created":{
        "en":`<b>{{performer}}</b> create a new task <b>({{documentName}})</b> for <b>{{assignedTo}}</b>`,
        "sp":`<b>{{performer}}</b> crea una nueva tarea <b>({{documentName}})</b> para <b>{{assignedTo}}</b>`,
     },
     "referral_task_status_update":{
      "en":`<b>{{performer}}</b> changes the status to <b>{{status}}</b> for task <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> cambia el estado a <b>{{status}}</b> para la tarea <b>({{documentName}})</b>`,
     },
      "form_shared":{
      "en":`<b>{{performer}}</b> share a form <b>({{formName}})</b> with <b>{{assignedTo}}</b>`,
      "sp":`<b>{{performer}}</b> comparte un formulario <b>({{formName}})</b> con <b>{{assignedTo}}</b>`,
     },
      "schedule_created":{
      "en":`<b>{{performer}}</b> creates a new schedule meeting with the <b>{{assignedTo}}</b> on <b><d>{{date}}</d></b>`,
      "sp":`<b>{{performer}}</b> crea una nueva reunión programada con <b>{{assignedTo}}</b> el <b><d>{{date}}</d></b>`,
     },
      "schedule_cancelled":{
      "en":`<b>{{performer}}</b> cancelled the meeting with the <b>{{assignedTo}}</b> on <b><d>{{date}}</d></b>`,
      "sp":`<b>{{performer}}</b> canceló la reunión con <b>{{assignedTo}}</b> el <b><d>{{date}}</d></b>`,
     },
     "form_response_update":{
      "en":`<b>{{performer}}</b> has submitted a response to the form <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> ha enviado una respuesta al formulario <b>({{documentName}})</b>`,
     },
     "automate_task":{
      "en":`Task <b>({{documentName}})</b> created for <b>{{assignedTo}}</b>`,
      "sp":`Tarea <b>({{documentName}})</b> creada para <b>{{assignedTo}}</b>`
     },
     "automate_task_status_update":{
      "en":`<b>{{performer}}</b> changes the status to <b>{{status}}</b> for Task <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> cambia el estado a <b>{{status}}</b> para la tarea <b>({{documentName}})</b>`,
     },
     "referral_status_update":{
      "en":`<b>{{performer}}</b> changes the status to <b>{{status}}</b> for Referral <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> cambia el estado a <b>{{status}}</b> para referencia <b>({{documentName}})</b>`,
     },
      "referral_status_updated":{
      "en":`<b>{{performer}}</b> changes the status to <b>{{status}}</b> for Referral <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> cambia el estado a <b>{{status}}</b> para referencia <b>({{documentName}})</b>`,
     },
      "account_link_with_referral":{
      "en":`<b>{{performer}}</b> configured FHIRedSHIP account <b>({{fsAccount}})</b> with referral account <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> configuró la cuenta FHIRedSHIP <b>({{fsAccount}})</b> con la cuenta de referencia <b>({{documentName}})</b>`,
     },
     "account_link_changed_with_referral":{
      "en":`<b>{{performer}}</b> changes the referral account configuration from account <b>({{prevRefAccount}})</b> to account <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> cambia la configuración de la cuenta de referencia de la cuenta <b>({{prevRefAccount}})</b> a la cuenta <b>({{documentName}})</b>`,
     },
     "enable_account_link_with_referral":{
      "en":`<b>{{performer}}</b> enabled the referral account <b>({{documentName}})</b> configuration</b>`,
      "sp":`<b>{{performer}}</b> habilitó la cuenta de referencia <b>({{documentName}})</b> configuración</b>`,
     },
     "disable_account_link_with_referral":{
      "en":`<b>{{performer}}</b> disabled the referral account <b>({{documentName}})</b> configuration</b>`,
      "sp":`<b>{{performer}}</b> inhabilitó la cuenta de referencia <b>({{documentName}})</b> configuración</b>`,
     },
     "disable_account_link_with_calendly":{
     "en":`<b>{{performer}}</b> disabled the Calendly account <b>({{documentName}})</b> configuration</b>`,
     "sp":`<b>{{performer}}</b> inhabilitó la cuenta de Calendly <b>({{documentName}})</b> configuración</b>`,
     },
    "enable_account_link_with_calendly":{
      "en":`<b>{{performer}}</b> enabled the calendly account <b>({{documentName}})</b> configuration</b>`,
      "sp":`<b>{{performer}}</b> habilitó la cuenta calendly <b>({{documentName}})</b> configuración</b>`,
     },
    "account_link_changed_with_calendly":{
      "en":`<b>{{performer}}</b> changes the calendly account configuration from account <b>({{prevCalendlyAccount}})</b> to account <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> cambia la configuración de la cuenta calendly de la cuenta <b>({{prevCalendlyAccount}})</b> a la cuenta <b>({{documentName}})</b>`,
     },
     "account_link_with_calendly":{
      "en":`<b>{{performer}}</b> configured FHIRedSHIP account <b>({{fsAccount}})</b> with calendly account <b>({{documentName}})</b>`,
      "sp":`<b>{{performer}}</b> configuró la cuenta FHIRedSHIP <b>({{fsAccount}})</b> con la cuenta calendly <b>({{documentName}})</b>`,
     },
  },
parameterMappingWithPatientRole:{
  patient:'patient',
  sid:'id',
  requester_type:'requester_type'
 },
 parameterMappingWithUserRole:{
  uuid:'id',
  sid:'id',
  id:'id',
  patient:'sid',
  requester_type:'requester_type',
  page:'page',
  limit:'limit'
 },
 formId:"631ace99dada916184021977",
 baseUrl:"http://test.fhir.com:8080",
 domain:{
    fs:`https://fs.com/fs`,//FHIRedSHIP App base url
    referral:'https://rf.com/rf' //Referral App base url
  },
 calendllyBaseUrl:"https://api.calendly.com", //calendly url
 referralStatusMapping:{
"Client no longer interested":"Revoked",
"Client could not be contacted":"Active",
"Got Help":"Completed",
"HHSC Completed":"Active",
"Fill HHSC":"Active",
"Screener Requested":"Active",
"Upload Documents":"Active",
"Not Eligible":"Revoked",
"Entered In Error":"entered-in-error",
"Schedule Meeting":"Active"
 },
 taskCompleteStatus:"Complete",
 statusListToNotifyPatient:["Client no longer interested","Client could not be contacted","Not Eligible","Entered In Error","Got Help"],
 defaultMetaJson:{
        "patient" : "",
        "cbo" : "",
        "chw" : "",
        "documentName" : "",
        "module" : "",
        "moduleId" : "",
        "subModule" : "",
        "subModuleId" : "",
        "message_en" : "",
        "message_sp" : "",
        "auditType":""

 },
 durationMapping:
  {
      day: 1,
      week: 7,
      month: 30,
      year: 365
  },
  scheduleConfig: {
    referralVerification: {
      ext: 'minute',
      id: 51454,
      span: 5,
      type: 'message',
      template: [],
      users: [],
    },
    referralFollowup1: {
      ext: 'minute',
      id: 51455,
      span: 1,
      type: 'message',
      template: [],
      users: [],
    },
    referralFollowup2: {
      ext: 'minute',
      id: 51456,
      span: 1,
      type: 'message',
      template: [],
      users: [],
    },
  },
  taskActionMapPat:{
    "Upload Documents":"review_upload",
    "screener shared":"review_screener",
    "referral_followup":"review_followup"
  },
  taskActionMapCbo:{
    "review_upload":"Schedule Meeting",
    "review_screener":"Upload Documents"
  },
  shareForm:{
    "_id" : "631ace99dada916184021977",
    "name" : "Personal Information Screener"
}

});
