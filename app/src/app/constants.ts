import { environment } from '../environments/environment';

export const { apiBaseUrl } = environment;

export interface ApiUrlConfig {
  users: string;
  getUserByEmailId: string;
  getUserByEVC: string;
  apps: string;
  notifications: string;
  getInviteCodeStatus: string;
  getLeapConsentPolicy: string;
  verifyEmailVerificationCode: string;
  inviteCodes: string;
  clinicalDataByCategory: string;
  verifyUser: string;
  getFhirPatientId: string;
  messages: string;
  logout: string;
  forgotPassword: string;
  generateAudit: string;
  declineAppConsent: string;
  getBiometricAccessToken: string;
  loginWithMagicLink: string;
  getTokenByHashkey: string;
  getAppRedirectionUrl:string;
  getAllInviteCodes:string;
  getRecruitmentRecord:string;
  assessments:string;
  updateRecrRecord:string;
  activateRecord:string;
  getExtConfg:string;
  saveExtConfig:string;
  isAuthenticated:string;
  patients:string;
  activity:string;
  condition:string;
  questionnaireresponse:string;
  referral:string;
  task:string;
  templates:string;
  response:string;
  notes:string;
  fileupload:string;
  notification:string;
  share:string;
  appointment:string;
  rule:string;
  settings:string;
}


export const apiUrlConfig: ApiUrlConfig = {
  rule:`${apiBaseUrl}/rule`,
  notification:`${apiBaseUrl}/notification`,
  task:`${apiBaseUrl}/task`,
  appointment:`${apiBaseUrl}/appointment`,
  templates:`${apiBaseUrl}/templates`,
  response:`${apiBaseUrl}/responses`,
  notes:`${apiBaseUrl}/notes`,
  fileupload:`${apiBaseUrl}/fileupload`,
  referral:`${apiBaseUrl}/referral`,
  share:`${apiBaseUrl}/share`,
  assessments:`${apiBaseUrl}/assessments`,
  questionnaireresponse:`${apiBaseUrl}/questionnaireresponse`,
  condition:`${apiBaseUrl}/condition`,
  activity: `${apiBaseUrl}/user/get/activity`,
  patients:`${apiBaseUrl}/patient`,
  users: `${apiBaseUrl}/user`,
  isAuthenticated:`${apiBaseUrl}/user/isAuthenticated`,
  getExtConfg:`${apiBaseUrl}/user/extension/config`,
  saveExtConfig:`${apiBaseUrl}/user/extension/config`,
  inviteCodes: `${apiBaseUrl}/inviteCodes`,
  updateRecrRecord:`${apiBaseUrl}/inviteCodes/record`,
  activateRecord:`${apiBaseUrl}/inviteCodes/record/active`,
  getRecruitmentRecord: `${apiBaseUrl}/inviteCodes`,
  getAllInviteCodes: `${apiBaseUrl}/inviteCodes/getAll`,
  getUserByEmailId: `${apiBaseUrl}/user/getUserByEmailId`,
  getUserByEVC: `${apiBaseUrl}/user/byEVC`,
  apps: `${apiBaseUrl}/apps`,
  notifications: `${apiBaseUrl}/notifications`,
  getInviteCodeStatus: `${apiBaseUrl}/inviteCodes/getStatus`,
  getLeapConsentPolicy: `${apiBaseUrl}/metadata/getLeapConsentPolicy`,
  verifyEmailVerificationCode: `${apiBaseUrl}/emailVerificationCodes/verify`,
  verifyUser: `${apiBaseUrl}/user/verify`,
  getFhirPatientId: `${apiBaseUrl}/user/getFhirPatientId`,
  clinicalDataByCategory: `${apiBaseUrl}/clinicalData/`,
  messages: `${apiBaseUrl}/message/`,
  logout: `${apiBaseUrl}/user/logout`,
  forgotPassword: `${apiBaseUrl}/user/forgot`,
  generateAudit: `${apiBaseUrl}/audit/generateAudit`,
  declineAppConsent: `${apiBaseUrl}/inviteCodes/declineAppConsent`,
  getBiometricAccessToken: `${apiBaseUrl}/user/getBiometricAccessToken`,
  loginWithMagicLink: `${apiBaseUrl}/user/magicLink`,
  getTokenByHashkey: `${apiBaseUrl}/user/getTokensFromHashkey`,
  getAppRedirectionUrl: `${apiBaseUrl}/apps/getAppRedirectionUrl`,
  settings:`${apiBaseUrl}/settings`
};
export const taskCompleteStatus = "Complete"
export const taskStatus = ["New","Pending","Draft","Hold","Complete"]
export const refStatus = [{name:"Client no longer interested",value:"Client no longer interested",id:"not_interested"},{name:"Client could not be contacted",value:"Client could not be contacted",id:"not_contacted"},{name:"Entered In Error",value:"Entered In Error",id:"errored"},{name:"Fill HHSC",value:"Fill HHSC",id:"hhsc_filled"},{name:"Got Help",value:"Got Help",id:"got_help"},{name:"HHSC Completed",value:"HHSC Completed",id:"hhsc_completed"},{name:"Not Eligible",value:"Not Eligible",id:"not_eligible"},{name:"Screener Requested",value:"Screener Requested",id:"screener_requested"},{name:"Schedule Meeting",value:"Schedule Meeting",id:"schedule_meeting"},{name:"Upload Documents",value:"Upload Documents",id:"upload_document"}];
export const automatedWorkflow = {"screener_requested":"upload_document","upload_document":"schedule_meeting"};
